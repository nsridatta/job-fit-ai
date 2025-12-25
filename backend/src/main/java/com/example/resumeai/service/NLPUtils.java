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

    // Split resume into real sections using a more robust parser
    public static Map<String, String> splitResumeIntoSections(String resumeText) {
        Map<String, String> sections = new LinkedHashMap<>();
        sections.put("Summary", extractSection(resumeText, List.of("summary", "objective", "profile")));
        sections.put("Skills", extractSection(resumeText, List.of("skills", "competencies", "tools")));
        sections.put("Experience", extractSection(resumeText, List.of("experience", "employment", "work history")));
        sections.put("Projects", extractSection(resumeText, List.of("projects", "personal projects", "portfolio")));
        sections.put("Education", extractSection(resumeText, List.of("education", "academic")));
        sections.put("Certifications", extractSection(resumeText, List.of("certifications", "licenses", "awards")));
        return sections;
    }

    private static String extractSection(String text, List<String> keywords) {
        String lowerText = text.toLowerCase();
        int startIndex = -1;
        String matchedKeyword = "";

        for (String keyword : keywords) {
            int idx = lowerText.indexOf(keyword);
            if (idx != -1 && (startIndex == -1 || idx < startIndex)) {
                startIndex = idx + keyword.length();
                matchedKeyword = keyword;
            }
        }

        if (startIndex == -1)
            return "No relevant section found.";

        // Find the next section header (typical words like Experience, Education, etc.
        // if we started at Summary)
        List<String> allSectionMarkers = Arrays.asList("summary", "objective", "skills", "experience", "employment",
                "education", "projects", "certifications", "contact");
        int nextSectionIndex = text.length();

        for (String marker : allSectionMarkers) {
            if (marker.equals(matchedKeyword))
                continue;
            int idx = lowerText.indexOf(marker, startIndex);
            if (idx != -1 && idx < nextSectionIndex) {
                nextSectionIndex = idx;
            }
        }

        String content = text.substring(startIndex, nextSectionIndex).trim();
        // Remove trailing colon or whitespace often found after headers
        if (content.startsWith(":"))
            content = content.substring(1).trim();

        return content.isEmpty() ? "Section found but content is empty." : content;
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
