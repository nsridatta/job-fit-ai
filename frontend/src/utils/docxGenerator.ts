import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

interface SectionData {
    score: number;
    suggestion: string;
    original: string;
    updated: string;
}

interface ResultsData {
    sections: { [key: string]: SectionData };
    overallSuggestion: string;
    jobMatchScore: number;
    missingKeywords: string[];
    templateVerdict: string;
}

interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
}

export const generateOptimizedDocx = async (
    data: ResultsData,
    editedContent: { [key: string]: string },
    personalInfo: PersonalInfo
) => {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Header / Name
                    new Paragraph({
                        text: personalInfo.name.toUpperCase() || "YOUR NAME",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin]
                                    .filter(Boolean)
                                    .join(" | ") || "your.email@example.com • +0 000 000 0000 • City, ST",
                                size: 20
                            })
                        ]
                    }),
                    new Paragraph({ text: "", spacing: { after: 200 } }),

                    // Summary Section
                    new Paragraph({
                        text: "PROFESSIONAL SUMMARY",
                        heading: HeadingLevel.HEADING_2,
                        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: editedContent["Summary"] || editedContent["summary"] || "Dedicated professional committed to continuous growth and delivering excellence."
                            }),
                        ],
                        spacing: { before: 200, after: 200 },
                    }),

                    // Skills Section
                    new Paragraph({
                        text: "CORE COMPETENCIES & SKILLS",
                        heading: HeadingLevel.HEADING_2,
                        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: editedContent["Skills"] || editedContent["skills"] || "Professional technical skills and core competencies.",
                                bold: true,
                                color: "00c091"
                            })
                        ],
                        spacing: { before: 200, after: 200 },
                    }),

                    // Dynamic Sections based on edited content
                    ...Object.entries(editedContent)
                        .filter(([name]) => !["SUMMARY", "SKILLS", "CONTACT"].includes(name.toUpperCase()))
                        .flatMap(([name, content]) => [
                            new Paragraph({
                                text: name.toUpperCase(),
                                heading: HeadingLevel.HEADING_2,
                                border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
                                spacing: { before: 400 },
                            }),
                            new Paragraph({
                                text: content,
                                spacing: { before: 200, after: 200 },
                            }),
                        ]),

                    // Note at bottom
                    new Paragraph({ text: "", spacing: { before: 1000 } }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Optimized for ATS compatibility by JobFit AI",
                                size: 16,
                                color: "999999",
                            })
                        ]
                    })
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "JobFit_Optimized_Resume.docx");
};
