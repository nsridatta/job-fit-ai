import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, VerticalAlign } from "docx";
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
    github?: string;
    title?: string;
}

// Helper to create a sidebar section title
const createSidebarHeader = (text: string) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                color: "FFFFFF",
                bold: true,
                size: 24,
            }),
        ],
        spacing: { before: 400, after: 200 },
        border: {
            bottom: {
                color: "FFFFFF",
                space: 1,
                value: BorderStyle.SINGLE,
                size: 6,
            },
        },
    });
};

// Helper for sidebar items (contact/skills)
const createSidebarItem = (text: string, isBullet: boolean = false) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: isBullet ? `○ ${text}` : text,
                color: "FFFFFF",
                size: 18,
            }),
        ],
        spacing: { before: 100, after: 100 },
    });
};

export const generateOptimizedDocx = async (
    data: ResultsData,
    editedContent: { [key: string]: string },
    personalInfo: PersonalInfo
) => {
    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Calibri",
                        size: 20,
                    },
                },
            },
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                        },
                    },
                },
                children: [
                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    // Sidebar (Left - 30%)
                                    new TableCell({
                                        width: {
                                            size: 30,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        shading: {
                                            fill: "133c55", // Deep Navy/Slate
                                            type: ShadingType.CLEAR,
                                            color: "auto",
                                        },
                                        margins: {
                                            top: 400,
                                            bottom: 400,
                                            left: 400,
                                            right: 400,
                                        },
                                        children: [
                                            // Profile Circle Placeholder (since we don't have user image)
                                            new Paragraph({ text: "", spacing: { before: 400 } }),

                                            createSidebarHeader("Personal Info"),
                                            createSidebarItem(personalInfo.phone || "9912500346"),
                                            createSidebarItem(personalInfo.email || "nsridatta@gmail.com"),
                                            createSidebarItem(personalInfo.location || "Hyderabad, India"),

                                            createSidebarHeader("Links"),
                                            createSidebarItem(personalInfo.linkedin ? "LinkedIn" : ""),
                                            personalInfo.github ? createSidebarItem("GitHub") : new Paragraph({}),

                                            createSidebarHeader("Skills"),
                                            ...(editedContent["Skills"] || editedContent["skills"] || "")
                                                .split(/[,\n]/)
                                                .map(s => s.trim())
                                                .filter(Boolean)
                                                .map(skill => createSidebarItem(skill, true)),
                                        ],
                                    }),

                                    // Main Content (Right - 70%)
                                    new TableCell({
                                        width: {
                                            size: 70,
                                            type: WidthType.PERCENTAGE,
                                        },
                                        margins: {
                                            top: 800,
                                            bottom: 800,
                                            left: 600,
                                            right: 800,
                                        },
                                        children: [
                                            // Name and Title
                                            new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: personalInfo.name || "SRI DATTA NELLUTLA",
                                                        bold: true,
                                                        size: 48,
                                                        color: "111111",
                                                    }),
                                                ],
                                            }),
                                            new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: personalInfo.title || "Senior Full Stack Developer",
                                                        size: 28,
                                                        color: "444444",
                                                    }),
                                                ],
                                                spacing: { after: 400 },
                                            }),

                                            // Summary
                                            new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: editedContent["Summary"] || editedContent["summary"] || "",
                                                        size: 20,
                                                    }),
                                                ],
                                                spacing: { after: 600 },
                                            }),

                                            // Experience Section Header
                                            new Paragraph({
                                                text: "Work Experience",
                                                heading: HeadingLevel.HEADING_2,
                                                border: {
                                                    bottom: {
                                                        color: "333333",
                                                        space: 1,
                                                        value: BorderStyle.SINGLE,
                                                        size: 6,
                                                    },
                                                },
                                            }),

                                            // Dynamic Main Sections
                                            ...Object.entries(editedContent)
                                                .filter(([name]) => !["SUMMARY", "SKILLS", "CONTACT"].includes(name.toUpperCase()))
                                                .flatMap(([name, content]) => [
                                                    new Paragraph({
                                                        children: [
                                                            new TextRun({
                                                                text: name.toUpperCase(),
                                                                bold: true,
                                                                size: 24,
                                                            })
                                                        ],
                                                        spacing: { before: 400, after: 200 },
                                                    }),
                                                    new Paragraph({
                                                        children: content.split('\n').map((line, i) => (
                                                            new TextRun({
                                                                text: line,
                                                                break: i > 0 ? 1 : 0
                                                            })
                                                        )),
                                                        spacing: { after: 200 },
                                                    }),
                                                ]),

                                            // Footer Note
                                            new Paragraph({ text: "", spacing: { before: 1000 } }),
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    new TextRun({
                                                        text: "Generated by JobFit AI Optimizer",
                                                        size: 16,
                                                        color: "999999",
                                                        italics: true,
                                                    })
                                                ]
                                            })
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${personalInfo.name.replace(/\s+/g, '_')}_Resume.docx`);
};
