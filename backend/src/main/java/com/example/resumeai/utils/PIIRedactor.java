package com.example.resumeai.utils;

public class PIIRedactor {
    public static String redactPII(String text) {
        return text.replaceAll("\\b[A-Za-z0-9._%+-]+@[A-Za-z.-]+\\.[A-Za-z]{2,}\\b", "[EMAIL]")
                   .replaceAll("\\b\\d{10,}\\b", "[PHONE]");
    }
}
