package com.example.resumeai.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.resumeai.model.CompletionRequest;
import com.example.resumeai.service.OpenRouterService;

@RestController
public class AIController {
    // private final ChatClient chatClient;

    // public AIController(ChatClient.Builder builder) {
    //     this.chatClient = builder.build();
    // }

    @Autowired
    private OpenRouterService openRouterService;

    // @PostMapping("/ai/completion")
    // public Map<String, String> completion(@RequestBody CompletionRequest request) {
    //     String response = chatClient.prompt()
    //         .user(request.getMessage())
    //         .call()
    //         .content();
    //     return Map.of("completion", response);
    // }

    @PostMapping("/ai/completion")
    public Map<String, String> completion(@RequestBody CompletionRequest request) {
        String response = openRouterService.getCompletion(request.getMessage());
        return Map.of("completion", response);
    }
}