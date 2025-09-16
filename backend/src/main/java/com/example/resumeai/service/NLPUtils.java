package com.example.resumeai.service;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class NLPUtils {

    // Basic keyword extractor (can be replaced with OpenNLP / StanfordNLP)
    public static Set<String> extractKeywords(String text) {
        return Arrays.stream(text.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3) // ignore small words
                .collect(Collectors.toSet());
    }

    // Split resume into mock sections (replace with proper parser if needed)
    public static Map<String, String> splitResumeIntoSections(String resumeText) {
        Map<String, String> sections = new LinkedHashMap<>();
        sections.put("Skills", extractSection(resumeText, "skills"));
        sections.put("Experience", extractSection(resumeText, "experience"));
        sections.put("Education", extractSection(resumeText, "education"));
        return sections;
    }

    private static String extractSection(String text, String keyword) {
        if (text.toLowerCase().contains(keyword)) {
            return "Sample " + keyword + " section extracted from resume.";
        }
        return "No " + keyword + " section found.";
    }

    // Calculate overlap between resume section and JD keywords
    public static int calculateKeywordOverlap(String section, Set<String> jdKeywords) {
        Set<String> sectionWords = extractKeywords(section);
        int overlap = 0;
        for (String word : sectionWords) {
            if (jdKeywords.contains(word)) {
                overlap++;
            }
        }
        return overlap * 10; // simple scoring logic
    }

    // Find missing keywords
    public static List<String> findMissingKeywords(String resume, Set<String> jdKeywords) {
        Set<String> resumeWords = extractKeywords(resume);
        return jdKeywords.stream()
                .filter(k -> !resumeWords.contains(k))
                .limit(10) // avoid flooding
                .collect(Collectors.toList());
    }

    // Generate a simple overall suggestion
    public static String generateOverallSuggestion(Map<String, Map<String, Object>> sections) {
        return "Focus on improving Skills and Experience alignment with the JD.";
    }

    // Dummy template check
    public static String checkTemplateFormat(String resume) {
        if (resume.length() < 200) {
            return "Resume seems too short. Expand with more details.";
        }
        return "Format looks acceptable.";
    }
}
