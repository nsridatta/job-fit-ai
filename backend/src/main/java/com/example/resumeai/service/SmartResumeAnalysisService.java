package com.example.resumeai.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class SmartResumeAnalysisService {


    private final ObjectMapper mapper = new ObjectMapper();
    private final OkHttpClient client = new OkHttpClient(); // ✅ define client

    private final String apiKey;
    private final boolean demoMode;

    private static final Logger LOG = LoggerFactory.getLogger(SmartResumeAnalysisService.class);

    // OkHttp’s MediaType for JSON
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    public SmartResumeAnalysisService(@Value("${spring.ai.openai.api-key}") String apiKey) {
        this.apiKey = apiKey;
        this.demoMode = "demo".equals(apiKey);
    }

    // Main entrypoint
    public Map<String, Object> analyzeResumeSmart(String resumeText, String jobDescription) {
        Map<String, Object> response = new HashMap<>();

        Set<String> jdKeywords = NLPUtils.extractKeywords(jobDescription);
        Map<String, String> resumeSections = NLPUtils.splitResumeIntoSections(resumeText);

        Map<String, Map<String, Object>> sections = new LinkedHashMap<>();

        for (Map.Entry<String, String> entry : resumeSections.entrySet()) {
            String sectionName = entry.getKey();
            String sectionContent = entry.getValue();

            int overlapScore = NLPUtils.calculateKeywordOverlap(sectionContent, jdKeywords);

            String suggestion = "";
            String updated = "";
            if (sectionName.equalsIgnoreCase("Skills") || sectionName.equalsIgnoreCase("Experience")) {
                Map<String, Object> gptResult = callGPTForSection(sectionContent, jobDescription);
                suggestion = (String) gptResult.getOrDefault("suggestion", "");
                updated = (String) gptResult.getOrDefault("updated", "");
            }

            Map<String, Object> sectionData = new HashMap<>();
            sectionData.put("score", overlapScore);
            sectionData.put("suggestion", suggestion);
            sectionData.put("updated", updated);

            sections.put(sectionName, sectionData);
        }

        response.put("sections", sections);
        response.put("overallSuggestion", NLPUtils.generateOverallSuggestion(sections));
        response.put("missingKeywords", NLPUtils.findMissingKeywords(resumeText, jdKeywords));
        response.put("templateVerdict", NLPUtils.checkTemplateFormat(resumeText));

        return response;
    }

    private Map<String, Object> callGPTForSection(String section, String jobDescription) {
        String prompt = """
        You are an expert resume reviewer.
        Compare the following resume section against the job description and suggest:
        1. A concise suggestion for improvement.
        2. An updated version of the section (ATS-friendly, concise).

        Resume Section:
        %s

        Job Description:
        %s
        """.formatted(section, jobDescription);

        return callOpenRouterAi(prompt);
    }

     /** Helper to call OpenRouter API (instead of OpenAI) */
    private Map<String, Object> callOpenRouterAi(String prompt) {
        LOG.info("Calling OpenRouter, demoMode={}", demoMode);
        LOG.info("Prompt: {}", prompt);

        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                // Build the request body (similar to OpenAI)
                String requestBody = mapper.writeValueAsString(Map.of(
                    "model", "nvidia/nemotron-nano-9b-v2:free", // Or your chosen model from OpenRouter
                    "messages", new Object[]{
                        Map.of("role", "system", "content", "You are a resume reviewer. Always return valid JSON without extra text."),
                        Map.of("role", "user", "content", prompt)
                    }
                ));

                // Build request for OpenRouter
                Request request = new Request.Builder()
                        .url("https://openrouter.ai/api/v1/chat/completions") // OpenRouter endpoint
                        .post(RequestBody.create(requestBody, JSON))
                        .addHeader("Authorization", "Bearer " + apiKey) // Your OpenRouter API key                        
                        .addHeader("X-Title", "Resume AI Analyzer") // Optional: Your app name
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


    private Map<String, Object> callOpenAi(String prompt) {
        try {
            String requestBody = mapper.writeValueAsString(Map.of(
                    "model", "gpt-4o-mini",
                    "messages", new Object[]{
                            Map.of("role", "system", "content", "You are a resume reviewer."),
                            Map.of("role", "user", "content", prompt)
                    }
            ));

            RequestBody body = RequestBody.create(requestBody, JSON); // ✅ use JSON constant

            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/chat/completions")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new IOException("Unexpected code: " + response);
                }

                String respBody = response.body().string();
                JsonNode root = mapper.readTree(respBody);
                String content = root.at("/choices/0/message/content").asText();

                // expect GPT to return JSON-ish text, attempt parse
                return mapper.readValue(content, Map.class);
            }
        } catch (Exception e) {
            return Map.of("error", "AI processing failed", "details", e.getMessage());
        }
    }
}
