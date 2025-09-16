package com.example.resumeai.model;

public class CompletionRequest {
    private String message;

    // Default constructor (required for JSON deserialization)
    public CompletionRequest() {
    }

    public CompletionRequest(String message) {
        this.message = message;
    }

    // Getter and setter
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}