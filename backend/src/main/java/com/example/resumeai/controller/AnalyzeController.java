package com.example.resumeai.controller;

import java.io.IOException;
import java.util.Map;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.resumeai.service.ResumeAnalyzerService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzeController {

    private final ResumeAnalyzerService resumeAnalyzerService;

    public AnalyzeController(ResumeAnalyzerService resumeAnalyzerService) {
        this.resumeAnalyzerService = resumeAnalyzerService;
    }

    @Operation(summary = "Analyze resume quality")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> analyzeResume(@RequestParam("file") MultipartFile file) throws IOException {
        String extractedText = extractPdfText(file);
        return resumeAnalyzerService.analyzeResume(extractedText);
    }

    @Operation(summary = "Analyze resume vs job description")
    @PostMapping(value = "/jobfit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyzeResumeWithJob(
            @RequestPart("resumeFile") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescription) throws IOException {

        String resumeText = extractPdfText(resumeFile);
        Map<String, Object> result =
                resumeAnalyzerService.analyzeResumeForJob(resumeText, jobDescription);

        return ResponseEntity.ok(result);
    }

    private String extractPdfText(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }    

}
