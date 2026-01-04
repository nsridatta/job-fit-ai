package com.example.resumeai.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

import com.example.resumeai.utils.PIIRedactor;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class ResumeAnalyzerService {

    private static final Logger LOG = LoggerFactory.getLogger(ResumeAnalyzerService.class);
    private static final okhttp3.MediaType JSON = okhttp3.MediaType.get("application/json; charset=utf-8");
    private final RetryTemplate retryTemplate; // Injected RetryTemplate

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS) // Increase connection timeout
            .readTimeout(60, TimeUnit.SECONDS) // Increase read timeout
            .writeTimeout(30, TimeUnit.SECONDS) // Increase write timeout
            .build();
    private final ObjectMapper mapper = new ObjectMapper();
    private final String apiKey;
    private final String model;
    private final boolean demoMode;

    public ResumeAnalyzerService(
            @Value("${spring.ai.openai.api-key}") String apiKey,
            @Value("${spring.ai.openai.chat.options.model}") String model,
            RetryTemplate retryTemplate) {
        this.apiKey = apiKey;
        this.model = model;
        this.demoMode = "demo".equals(apiKey);
        this.retryTemplate = retryTemplate;
        LOG.info("ResumeAnalyzerService initialized, demoMode={}, model={}", demoMode, model);
    }

    /** Existing method - general resume analysis with original content support */
    public Map<String, Object> analyzeResume(String text) {
        if (demoMode) {
            return Map.of(
                    "sections", Map.of(
                            "Contact",
                            Map.of("score", 18, "original", "Contact details", "suggestion", "Add LinkedIn profile"),
                            "Summary",
                            Map.of("score", 15, "original", "Professional summary", "suggestion",
                                    "Make summary metrics-driven")),
                    "totalScore", 82,
                    "overallSuggestion", "Strong resume; improve summary and quantify achievements.",
                    "updatedInfo", new String[] { "Add dates for latest job", "Quantify team size" },
                    "templateVerdict", "ATS-friendly ✅");
        }

        Map<String, String> resumeSections = NLPUtils.splitResumeIntoSections(text);
        Map<String, Map<String, Object>> sectionResults = new LinkedHashMap<>();

        String combinedPrompt = """
                [STRICT JSON MODE]
                Analyze the following resume sections and return ONLY a JSON object.

                REQUIRED STRUCTURE:
                {
                  "templateVerdict": "ATS-friendly ✅ or similar",
                  "totalScore": 0-100,
                  "overallSuggestion": "string",
                  "sections": {
                    "Summary": {"score": 0-10, "suggestion": "string"},
                    "Skills": {"score": 0-10, "suggestion": "string"},
                    "Experience": {"score": 0-10, "suggestion": "string"},
                    "Projects": {"score": 0-10, "suggestion": "string"},
                    "Education": {"score": 0-10, "suggestion": "string"},
                    "Certifications": {"score": 0-10, "suggestion": "string"}
                  },
                  "updatedInfo": ["string"]
                }

                CRITICAL RULES:
                1. Every section MUST be a key inside the "sections" object.
                2. Return ONLY clean text. Do NOT use random symbols, markdown formatting inside values, or complex ASCII art.
                3. For "Skills", provide a comma-separated list or clean newlines.

                Resume Data:
                %s
                """
                .formatted(resumeSections.toString());

        Map<String, Object> aiResponse = retryTemplate.execute(context -> callOpenRouterAi(combinedPrompt));

        // Post-process: Implement "Stamping" and conditional Original merge
        int totalScore = 0;
        if (aiResponse.containsKey("totalScore")) {
            Object scoreObj = aiResponse.get("totalScore");
            if (scoreObj instanceof Number) {
                totalScore = ((Number) scoreObj).intValue();
            }
        }

        if (aiResponse.containsKey("sections")) {
            Object sectionsObj = aiResponse.get("sections");
            if (sectionsObj instanceof Map) {
                Map<String, Map<String, Object>> aiSections = (Map<String, Map<String, Object>>) sectionsObj;
                for (String name : resumeSections.keySet()) {
                    Map<String, Object> result = aiSections.getOrDefault(name, new HashMap<>());

                    // Always include original for frontend if score is mid-range
                    if (totalScore >= 40 && totalScore <= 65) {
                        result.put("original", resumeSections.get(name));
                    }

                    // Stamping: If score > 8, use original as updated
                    int sectionScore = 0;
                    if (result.containsKey("score")) {
                        Object s = result.get("score");
                        if (s instanceof Number)
                            sectionScore = ((Number) s).intValue();
                    }

                    if (sectionScore >= 9) {
                        result.put("updated", resumeSections.get(name));
                    }

                    sectionResults.put(name, result);
                }
                aiResponse.put("sections", sectionResults);
            }
        }

        return aiResponse;
    }

    /**
     * New method - resume vs job description analysis with original content support
     */
    public Map<String, Object> analyzeResumeForJob(String resumeText, String jobDescription) {
        if (demoMode) {
            return Map.of(
                    "sections", Map.of(
                            "Summary",
                            Map.of("score", 14, "original", "Resume Summary", "suggestion", "Add cloud keywords",
                                    "updated", "Updated summary with AWS/DevOps"),
                            "Experience",
                            Map.of("score", 17, "original", "Work experience", "suggestion",
                                    "Match responsibilities to JD", "updated", "Added CI/CD pipeline achievements")),
                    "jobMatchScore", 76,
                    "overallSuggestion", "Tailor experience to highlight cloud skills.",
                    "missingKeywords", new String[] { "Kubernetes", "CI/CD" },
                    "templateVerdict", "ATS-friendly ✅");
        }

        Map<String, String> resumeSections = NLPUtils.splitResumeIntoSections(resumeText);
        Set<String> jdKeywords = NLPUtils.extractKeywords(jobDescription);
        Map<String, Map<String, Object>> sectionResults = new LinkedHashMap<>();

        String prompt = """
                [STRICT JSON MODE]
                Compare these resume sections with the Job Description.
                Return ONLY a valid JSON object.

                REQUIRED STRUCTURE:
                {
                  "templateVerdict": "ATS-friendly ✅ or similar",
                  "jobMatchScore": 0-100,
                  "overallSuggestion": "string",
                  "missingKeywords": ["string"],
                  "sections": {
                    "Summary": {"score": 0-10, "suggestion": "string", "updated": "ready-to-use text"},
                    "Skills": {"score": 0-10, "suggestion": "string", "updated": "ready-to-use text"},
                    "Experience": {"score": 0-10, "suggestion": "string", "updated": "ready-to-use text"},
                    "Projects": {"score": 0-10, "suggestion": "string", "updated": "ready-to-use text"},
                    "Education": {"score": 0-10, "suggestion": "string", "updated": "ready-to-use text"},
                    "Certifications": {"score": 0-10, "suggestion": "string", "updated": "ready-to-use text"}
                  }
                }

                CRITICAL RULES:
                1. Every category (like Experience, Skills, etc.) MUST be a key inside the "sections" object. Do NOT put them at the root.
                2. The "updated" field MUST contain ready-to-use resume text tailored to the Job Description.
                3. Return ONLY clean text. Do NOT use random symbols, markdown formatting inside values, or complex ASCII art.
                4. For "Skills", provide a comma-separated list or clean newlines.

                Resume Data:
                %s

                Job Description:
                %s
                """
                .formatted(resumeSections.toString(), jobDescription);

        Map<String, Object> aiResponse = retryTemplate.execute(context -> callOpenRouterAi(prompt));

        // Post-process: Implement "Stamping" and conditional Original merge
        int matchScore = 0;
        if (aiResponse.containsKey("jobMatchScore")) {
            Object scoreObj = aiResponse.get("jobMatchScore");
            if (scoreObj instanceof Number) {
                matchScore = ((Number) scoreObj).intValue();
            }
        }

        if (aiResponse.containsKey("sections")) {
            Object sectionsObj = aiResponse.get("sections");
            if (sectionsObj instanceof Map) {
                Map<String, Map<String, Object>> aiSections = (Map<String, Map<String, Object>>) sectionsObj;
                for (String name : resumeSections.keySet()) {
                    Map<String, Object> result = aiSections.getOrDefault(name, new HashMap<>());

                    // Always include original for frontend if score is mid-range
                    if (matchScore >= 40 && matchScore <= 65) {
                        result.put("original", resumeSections.get(name));
                    }

                    // Stamping: If score > 8, use original as updated
                    int sectionScore = 0;
                    if (result.containsKey("score")) {
                        Object s = result.get("score");
                        if (s instanceof Number)
                            sectionScore = ((Number) s).intValue();
                    }

                    if (sectionScore >= 9) {
                        result.put("updated", resumeSections.get(name));
                    }

                    sectionResults.put(name, result);
                }
                aiResponse.put("sections", sectionResults);
            }
        }

        return aiResponse;
    }

    /**
     * Generate a matching cover letter based on resume and job description
     */
    public Map<String, Object> generateCoverLetter(String resumeText, String jobDescription) {
        if (demoMode) {
            return Map.of("content", "Dear Hiring Manager,\n\nI am excited to apply for this position...");
        }

        String prompt = """
                Generate a professional and compelling cover letter.
                Use the following resume details and Job Description to tailor the content.
                Return ONLY the cover letter text, no metadata.

                Resume Data:
                %s

                Job Description:
                %s
                """
                .formatted(resumeText, jobDescription);

        // We use callOpenRouterAiRaw here because we only want plain text, not a JSON
        // object
        return callOpenRouterAiRaw(prompt);
    }

    /**
     * Generate a 3-day roadmap for missing skills
     */
    public Map<String, Object> generateLearningRoadmap(String missingSkills) {
        if (demoMode) {
            return Map.of("content", "Day 1: Basics of " + missingSkills + "...");
        }

        String prompt = """
                Create a high-impact, 3-day learning roadmap to acquire the following missing skills: %s.
                Focus on the most critical concepts and practical application.
                Return ONLY the roadmap text in a clean, professional format (markdown is okay).
                """
                .formatted(missingSkills);

        return callOpenRouterAiRaw(prompt);
    }

    /** Helper to call OpenRouter for raw text content instead of structured JSON */
    private Map<String, Object> callOpenRouterAiRaw(String prompt) {
        LOG.info("Calling OpenRouter for raw content, demoMode={}", demoMode);
        try {
            String requestBody = mapper.writeValueAsString(Map.of(
                    "model", model,
                    "messages", new Object[] {
                            Map.of("role", "system", "content",
                                    "You are a professional career coach. Return ONLY the requested content."),
                            Map.of("role", "user", "content", prompt)
                    }));

            Request request = new Request.Builder()
                    .url("https://openrouter.ai/api/v1/chat/completions")
                    .post(RequestBody.create(requestBody, JSON))
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful())
                    throw new IOException("Unexpected code: " + response);
                String body = response.body().string();
                JsonNode root = mapper.readTree(body);
                String content = root.at("/choices/0/message/content").asText();
                return Map.of("content", content);
            }
        } catch (Exception e) {
            LOG.error("Error calling OpenRouter: {}", e.getMessage());
            return Map.of("error", "Generation failed", "details", e.getMessage());
        }
    }

    /** Helper to call OpenRouter API (instead of OpenAI) */
    private Map<String, Object> callOpenRouterAi(String prompt) {
        LOG.info("Calling OpenRouter, demoMode={}", demoMode);

        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                // Build the request body (similar to OpenAI)
                String requestBody = mapper.writeValueAsString(Map.of(
                        "model", model, // Use injected model name
                        "messages", new Object[] {
                                Map.of("role", "system", "content",
                                        "You are a resume reviewer. Always return valid JSON without extra text."),
                                Map.of("role", "user", "content", prompt)
                        }));

                // Build request for OpenRouter
                Request request = new Request.Builder()
                        .url("https://openrouter.ai/api/v1/chat/completions") // OpenRouter endpoint
                        .post(RequestBody.create(requestBody, JSON))
                        .addHeader("Authorization", "Bearer " + apiKey) // Your OpenRouter API key
                        .addHeader("X-Title", "Job Fit AI ATS Resume Analyzer") // Optional: Your app name
                        .build();

                try (Response response = client.newCall(request).execute()) {
                    if (response.code() == 429) {
                        LOG.warn("Rate limit hit (attempt {}), backing off...", attempt);
                        Thread.sleep(1000L * attempt); // Exponential backoff
                        continue; // Retry
                    }
                    if (!response.isSuccessful()) {
                        LOG.error("OpenRouter call failed: HTTP {}", response.code());
                        throw new IOException("Unexpected code: " + response);
                    }

                    String body = response.body().string();
                    JsonNode root = mapper.readTree(body);

                    // Extract content from OpenRouter's response (same as OpenAI)
                    String content = root.at("/choices/0/message/content").asText();

                    // Cleanup common AI prefix/suffix like ```json or ```
                    content = content.trim();
                    if (content.startsWith("```json"))
                        content = content.substring(7);
                    if (content.startsWith("```"))
                        content = content.substring(3);
                    if (content.endsWith("```"))
                        content = content.substring(0, content.length() - 3);
                    content = content.trim();

                    return mapper.readValue(content, Map.class);
                }
            } catch (Exception e) {
                LOG.error("Error calling OpenRouter: {}", e.getMessage(), e);
                if (attempt == 3) {
                    return Map.of("error", "AI processing failed", "details", e.getMessage());
                }
            }
        }
        return Map.of("error", "AI processing failed", "details", "Retries exhausted");
    }

}
