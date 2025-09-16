package com.example.resumeai.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.openai.api.common.OpenAiApiClientErrorException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class OpenRouterService {

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    private static final Logger LOG = LoggerFactory.getLogger(OpenRouterService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    public String getCompletion(String message) {
        try {
           String url = "https://openrouter.ai/api/v1/chat/completions";

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            // Request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "nvidia/nemotron-nano-9b-v2:free"); // Or your chosen model
            requestBody.put("messages", List.of(
                Map.of("role", "user", "content", message)
            ));

            // Entity with headers and body
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            LOG.info("Sending request to OpenRouter: {}", requestBody);

            LOG.info("Using API Key: {}", apiKey != null && !apiKey.isEmpty() ? "Provided with " + apiKey : "Not Provided");
            LOG.info("Request URL: {}", url);
            LOG.info("Request Headers: {}", headers);
            LOG.info("Request Body: {}", requestBody);

            // Send POST request
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class);

            // Extract response (adjust based on actual response structure)
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Navigate the response map to extract the completion text
                // The exact path depends on OpenRouter's response structure
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map firstChoice = choices.get(0);
                    Map messageMap = (Map) firstChoice.get("message");
                    return (String) messageMap.get("content");
                }
            }
            return "Error: Unable to get response";
        } catch (OpenAiApiClientErrorException e) {
            String url = "https://openrouter.ai/api/v1/chat/completions";

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            // Request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "google/gemini-2.0-flash:free"); // Or your chosen model
            requestBody.put("messages", List.of(
                Map.of("role", "user", "content", message)
            ));

            // Entity with headers and body
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            LOG.info("Sending request to OpenRouter: {}", requestBody);

            LOG.info("Using API Key: {}", apiKey != null && !apiKey.isEmpty() ? "Provided with " + apiKey : "Not Provided");
            LOG.info("Request URL: {}", url);
            LOG.info("Request Headers: {}", headers);
            LOG.info("Request Body: {}", requestBody);

            // Send POST request
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class);

            // Extract response (adjust based on actual response structure)
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Navigate the response map to extract the completion text
                // The exact path depends on OpenRouter's response structure
                List<Map> choices = (List<Map>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map firstChoice = choices.get(0);
                    Map messageMap = (Map) firstChoice.get("message");
                    return (String) messageMap.get("content");
                }
            }
            return "Error: Unable to get response";
        }
        
    }
}