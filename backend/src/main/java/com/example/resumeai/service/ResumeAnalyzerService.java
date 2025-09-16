package com.example.resumeai.service;

import java.io.IOException;
import java.util.Map;
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
    .connectTimeout(60, TimeUnit.SECONDS)  // Increase connection timeout
    .readTimeout(60, TimeUnit.SECONDS)     // Increase read timeout
    .writeTimeout(30, TimeUnit.SECONDS)    // Increase write timeout
    .build();
    private final ObjectMapper mapper = new ObjectMapper();
    private final String apiKey;
    private final boolean demoMode;

    public ResumeAnalyzerService(@Value("${spring.ai.openai.api-key}") String apiKey, RetryTemplate retryTemplate) {
        this.apiKey = apiKey;
        this.demoMode = "demo".equals(apiKey);
        LOG.info("ResumeAnalyzerService initialized, demoMode={}", demoMode);
        LOG.info("api key: {}", apiKey);
        this.retryTemplate = retryTemplate;        
        LOG.info("ResumeAnalyzerService initialized, demoMode={}", demoMode);
    }

    /** Existing method - general resume analysis */
    public Map<String, Object> analyzeResume(String text) {
        if (demoMode) {
            return Map.of(
                    "sections", Map.of(
                            "Contact", Map.of("score", 180, "suggestion", "Add LinkedIn profile"),
                            "Summary", Map.of("score", 150, "suggestion", "Make summary metrics-driven")
                    ),
                    "totalScore", 820,
                    "overallSuggestion", "Strong resume; improve summary and quantify achievements.",
                    "updatedInfo", new String[]{"Add dates for latest job", "Quantify team size"},
                    "templateVerdict", "ATS-friendly ✅"
            );
        }

        String prompt = """
            You are a professional resume reviewer.
            Analyze the following resume text and return ONLY JSON with:
            {
              "sections": {
                "Contact": {"score": <int>, "suggestion": "<string>"},
                "Summary": {"score": <int>, "suggestion": "<string>"},
                "Experience": {"score": <int>, "suggestion": "<string>"},
                "Education": {"score": <int>, "suggestion": "<string>"},
                "Skills": {"score": <int>, "suggestion": "<string>"}
              },
              "totalScore": <int>,
              "overallSuggestion": "<string>",
              "updatedInfo": ["<string>", "<string>"],
              "templateVerdict": "<string>"
            }

            Resume text:
            %s
            """.formatted(text);

            String redactedPrompt = PIIRedactor.redactPII(prompt);
            LOG.info("Sending request to OpenRouter with redacted prompt: {}", redactedPrompt);

        // return callOpenAi(prompt);
        // return callOpenRouterAi(prompt);
         return retryTemplate.execute(context -> {
            int attempt = context.getRetryCount() + 1;
            LOG.info("OpenRouter API call attempt {}", attempt);
            return callOpenRouterAi(prompt);
        });
        
    }
    // As we are using RetryTemplate, @Retryable is not needed
    // @Retryable(
    //     retryFor = SocketTimeoutException.class, // Retry on timeouts
    //     maxAttempts = 3,
    //     backoff = @Backoff(delay = 1000, multiplier = 2, maxDelay = 10000, random = true)
    // )
    /** New method - resume vs job description analysis */
    public Map<String, Object> analyzeResumeForJob(String resumeText, String jobDescription) {
        if (demoMode) {
            return Map.of(
                    "sections", Map.of(
                            "Summary", Map.of("score", 140, "suggestion", "Add cloud keywords", "updated", "Updated summary with AWS/DevOps"),
                            "Experience", Map.of("score", 170, "suggestion", "Match responsibilities to JD", "updated", "Added CI/CD pipeline achievements")
                    ),
                    "jobMatchScore", 760,
                    "overallSuggestion", "Tailor experience to highlight cloud skills.",
                    "missingKeywords", new String[]{"Kubernetes", "CI/CD"},
                    "templateVerdict", "ATS-friendly ✅"
            );
        }

        String prompt = """
            You are a professional recruiter and resume reviewer.
            Compare the following resume with the given job description.

            Return ONLY JSON with:
            {
              "sections": {
                "Contact": {"score": <int>, "suggestion": "<string>", "updated": "<string>"},
                "Summary": {"score": <int>, "suggestion": "<string>", "updated": "<string>"},
                "Experience": {"score": <int>, "suggestion": "<string>", "updated": "<string>"},
                "Education": {"score": <int>, "suggestion": "<string>", "updated": "<string>"},
                "Skills": {"score": <int>, "suggestion": "<string>", "updated": "<string>"}
              },
              "jobMatchScore": <int> // out of 100,
              "overallSuggestion": "<string>",
              "missingKeywords": ["<string>", "<string>"],
              "templateVerdict": "<string>"
            }

            Resume text:
            %s

            Job description:
            %s
            """.formatted(resumeText, jobDescription);

            String redactedPrompt = PIIRedactor.redactPII(prompt);
            LOG.info("Sending request to OpenRouter with redacted prompt: {}", redactedPrompt);

        // return callOpenAi(prompt);
        // return callOpenRouterAi(prompt);
         return retryTemplate.execute(context -> {
            int attempt = context.getRetryCount() + 1;
            LOG.info("OpenRouter API call attempt {}", attempt);
            return callOpenRouterAi(prompt);
        });

            // LOG.info("Prompt from analyzeResumeForJob method: {}", prompt);

        // return callOpenAi(prompt);
        // return callOpenRouterAi(prompt);
    }

    //  @Recover
    // public Map<String, Object> recover(SocketTimeoutException e, String resumeText, String jobDescription) {
    //     LOG.error("All retry attempts failed for OpenRouter call", e);
    //     return Map.of("error", "AI service unavailable", "details", "Timeout after retries");
    // }

    /** Helper to call OpenAI API */
    private Map<String, Object> callOpenAi(String prompt) {
        LOG.info("Calling OpenAI, demoMode={}", demoMode);
        LOG.info("api key: {}", apiKey);
        LOG.info("prompt going from callOpenAi method : {}", prompt);

        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                // 🔹 Build the request body here
                String requestBody = mapper.writeValueAsString(Map.of(
                    "model", "gpt-3.5-turbo",
                    "messages", new Object[]{
                        Map.of("role", "system", "content", "You are a resume reviewer."),
                        Map.of("role", "user", "content", prompt)
                    }
                ));

                // 🔹 Build request
                Request request = new Request.Builder()
                        .url("https://api.openai.com/v1/chat/completions")
                        .post(RequestBody.create(requestBody, JSON))
                        .addHeader("Authorization", "Bearer " + apiKey)
                        .build();

                try (Response response = client.newCall(request).execute()) {
                    if (response.code() == 429) {
                        LOG.warn("Rate limit hit (attempt {}), backing off...", attempt);
                        Thread.sleep(1000L * attempt); // exponential backoff
                        continue; // retry
                    }
                    if (!response.isSuccessful()) {
                        LOG.error("OpenAI call failed: HTTP {}", response.code());
                        throw new IOException("Unexpected code: " + response);
                    }

                    
                    String body = response.body().string();
                    JsonNode root = mapper.readTree(body);

                    // ✅ Extract content
                    String content = root.at("/choices/0/message/content").asText();
                    return mapper.readValue(content, Map.class);
                }
            } catch (Exception e) {
                LOG.error("Error calling OpenAI: {}", e.getMessage(), e);
                if (attempt == 3) {
                    return Map.of("error", "AI processing failed", "details", e.getMessage());
                }
            }
        }
        return Map.of("error", "AI processing failed", "details", "Retries exhausted");
    }

    /** Helper to call OpenRouter API (instead of OpenAI) */
    private Map<String, Object> callOpenRouterAi(String prompt) {
        LOG.info("Calling OpenRouter, demoMode={}", demoMode);      

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

}
