package com.example.resumeai.controller;

import java.io.IOException;
import java.util.Map;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.resumeai.service.SmartResumeAnalysisService;

@RestController
@RequestMapping("/api/smart")
public class SmartAnalyzeController {

    @Autowired
    private SmartResumeAnalysisService smartService;

    @PostMapping(value="/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> analyze(
           @RequestPart("resumeFile") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jd) throws IOException {
                String resumeText = extractPdfText(resumeFile);
        return ResponseEntity.ok(smartService.analyzeResumeSmart(resumeText, jd));
    }

    private String extractPdfText(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}
    