import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        padding: 0,
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '32%',
        backgroundColor: '#133c55',
        color: '#FFFFFF',
        padding: 20,
        height: '100%',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        objectFit: 'cover',
    },
    main: {
        marginLeft: '32%',
        width: '68%',
        padding: 40,
    },
    sidebarHeader: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#FFFFFF',
        paddingBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sidebarItem: {
        fontSize: 9,
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sidebarLink: {
        fontSize: 9,
        color: '#FFFFFF',
        textDecoration: 'underline',
        marginBottom: 4,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
    },
    bullet: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        marginRight: 6,
    },
    bulletText: {
        fontSize: 9,
        color: '#FFFFFF',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111111',
    },
    title: {
        fontSize: 14,
        color: '#444444',
        marginBottom: 15,
    },
    summary: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        paddingBottom: 2,
        textTransform: 'uppercase',
    },
    contentItem: {
        fontSize: 10,
        lineHeight: 1.4,
        marginBottom: 10,
        color: '#333333',
    },
    experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 2,
    },
    jobTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#111111',
        maxWidth: '75%',
    },
    dateRange: {
        fontSize: 9,
        color: '#777777',
        fontStyle: 'italic',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 8,
        color: '#999999',
        fontStyle: 'italic',
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
    underline: {
        textDecoration: 'underline',
    },
    strike: {
        textDecoration: 'line-through',
    },
    header1: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#111111',
    },
    header2: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
        color: '#222222',
    },
    blockquote: {
        borderLeftWidth: 2,
        borderLeftColor: '#eeeeee',
        paddingLeft: 10,
        fontStyle: 'italic',
        marginVertical: 5,
    },
    code: {
        fontFamily: 'Courier',
        backgroundColor: '#f5f5f5',
        padding: 5,
        fontSize: 9,
    },
    link: {
        color: '#0066cc',
        textDecoration: 'underline',
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 10,
    },
    listBullet: {
        width: 3,
        height: 3,
        backgroundColor: '#333333',
        borderRadius: 1.5,
        marginTop: 4,
        marginRight: 6,
    },
    listNumber: {
        fontSize: 9,
        marginRight: 5,
        minWidth: 15,
    },
    listContent: {
        flex: 1,
    }
});

const decodeEntities = (text: string) => {
    if (!text) return '';
    return text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\u00A0/g, ' '); // Also handle Unicode non-breaking space
};

const stripTags = (html: string) => {
    if (!html) return '';
    // Remove all HTML tags and decode entities
    const withoutTags = html.replace(/<[^>]*>?/gm, '');
    return decodeEntities(withoutTags).trim();
};

interface ResumePDFProps {
    personalInfo: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
        github: string;
        profilePic: string;
        languages: string;
    };
    editedContent: { [key: string]: string };
}

const RichText: React.FC<{ html: string; style?: any }> = ({ html, style }) => {
    if (!html) return null;

    const parseContent = (text: string) => {
        let clean = text.replace(/<p><br><\/p>/g, '\n');

        // Split by major blocks
        const blocks = clean.split(/(<\/h1>|<\/h2>|<\/p>|<\/li>|<\/blockquote>|<\/pre>|<\/ul>|<\/ol>|<br\s*\/?>)/gi);

        // Track list numbering
        let listCounter = 0;
        let inOrderedList = false;

        return blocks.map((block, idx) => {
            if (!block.trim() && !block.includes('\n')) return null;

            // List handling
            if (block.includes('<ol')) { inOrderedList = true; listCounter = 0; return null; }
            if (block.includes('</ol')) { inOrderedList = false; return null; }
            if (block.includes('<ul')) { inOrderedList = false; return null; }

            if (block.includes('<li')) {
                const content = block.replace(/<li[^>]*>/gi, '').replace(/<\/li>/gi, '');
                listCounter++;
                return (
                    <View key={idx} style={styles.listItem}>
                        {inOrderedList ? (
                            <Text style={styles.listNumber}>{listCounter}.</Text>
                        ) : (
                            <View style={styles.listBullet} />
                        )}
                        <Text style={[styles.contentItem, styles.listContent, style]}>
                            {renderStyledText(content)}
                        </Text>
                    </View>
                );
            }

            // Header handling
            if (block.includes('<h1')) {
                const content = block.replace(/<h1[^>]*>/gi, '').replace(/<\/h1>/gi, '');
                return <Text key={idx} style={styles.header1}>{renderStyledText(content)}</Text>;
            }
            if (block.includes('<h2')) {
                const content = block.replace(/<h2[^>]*>/gi, '').replace(/<\/h2>/gi, '');
                return <Text key={idx} style={styles.header2}>{renderStyledText(content)}</Text>;
            }

            // Blockquote handling
            if (block.includes('<blockquote')) {
                const content = block.replace(/<blockquote[^>]*>/gi, '').replace(/<\/blockquote>/gi, '');
                return <View key={idx} style={styles.blockquote}>{renderStyledText(content)}</View>;
            }

            // Pre/Code handling
            if (block.includes('<pre')) {
                const content = block.replace(/<pre[^>]*>/gi, '').replace(/<\/pre>/gi, '').replace(/<code[^>]*>/gi, '').replace(/<\/code>/gi, '');
                return <Text key={idx} style={styles.code}>{decodeEntities(content)}</Text>;
            }

            // Regular paragraph/block
            const content = block.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '');
            if (!content.trim()) return null;

            return (
                <Text key={idx} style={[styles.contentItem, style]}>
                    {renderStyledText(content)}
                </Text>
            );
        }).filter(Boolean);
    };

    const renderStyledText = (text: string) => {
        const parts = text.split(/(<strong[^>]*>.*?<\/strong>|<b[^>]*>.*?<\/b>|<em[^>]*>.*?<\/em>|<i[^>]*>.*?<\/i>|<u[^>]*>.*?<\/u>|<s[^>]*>.*?<\/s>|<a[^>]*>.*?<\/a>)/gi);

        return parts.map((part, i) => {
            if (!part) return null;

            // Extract styling if it's a styled part
            if (part.match(/<(strong|b)[^>]*>/i)) {
                return <Text key={i} style={styles.bold}>{decodeEntities(part.replace(/<[^>]+>/g, ''))}</Text>;
            }
            if (part.match(/<(em|i)[^>]*>/i)) {
                return <Text key={i} style={styles.italic}>{decodeEntities(part.replace(/<[^>]+>/g, ''))}</Text>;
            }
            if (part.match(/<u[^>]*>/i)) {
                return <Text key={i} style={styles.underline}>{decodeEntities(part.replace(/<[^>]+>/g, ''))}</Text>;
            }
            if (part.match(/<s[^>]*>/i)) {
                return <Text key={i} style={styles.strike}>{decodeEntities(part.replace(/<[^>]+>/g, ''))}</Text>;
            }
            if (part.match(/<a[^>]*>/i)) {
                return <Text key={i} style={styles.link}>{decodeEntities(part.replace(/<[^>]+>/g, ''))}</Text>;
            }

            // Plain text part: strip any remaining tags (shouldn't be any but safety first) and decode
            const plain = decodeEntities(part.replace(/<[^>]+>/g, ''));
            return plain || null;
        });
    };

    return <View>{parseContent(html)}</View>;
};

const ResumePDF: React.FC<ResumePDFProps> = ({ personalInfo, editedContent }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Sidebar */}
            <View style={styles.sidebar} fixed>
                {personalInfo.profilePic && (
                    <View style={styles.profileContainer}>
                        <Image src={personalInfo.profilePic} style={styles.profilePic} />
                    </View>
                )}

                <View style={{ marginTop: personalInfo.profilePic ? 0 : 20 }} />

                <Text style={styles.sidebarHeader}>Personal Info</Text>
                <Text style={styles.sidebarItem}>{personalInfo.phone}</Text>
                <Text style={styles.sidebarItem}>{personalInfo.email}</Text>
                <Text style={styles.sidebarItem}>{personalInfo.location}</Text>

                <Text style={styles.sidebarHeader}>Links</Text>
                {personalInfo.linkedin && (
                    <Text style={styles.sidebarLink}>{personalInfo.linkedin.includes('http') ? 'LinkedIn' : personalInfo.linkedin}</Text>
                )}
                {personalInfo.github && (
                    <Text style={styles.sidebarLink}>{personalInfo.github.includes('http') ? 'GitHub' : personalInfo.github}</Text>
                )}

                <Text style={styles.sidebarHeader}>Skills</Text>
                {stripTags(editedContent["Skills"] || editedContent["skills"] || "")
                    .split(/[,\n]/)
                    .map(s => s.trim())
                    .filter(Boolean)
                    .map((skill, i) => (
                        <View key={i} style={styles.bulletRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.bulletText}>{skill}</Text>
                        </View>
                    ))}

                {personalInfo.languages && (
                    <>
                        <Text style={styles.sidebarHeader}>Languages</Text>
                        {personalInfo.languages.split(/[,\n]/).map(l => l.trim()).filter(Boolean).map((lang, i) => (
                            <View key={i} style={styles.bulletRow}>
                                <View style={styles.bullet} />
                                <Text style={styles.bulletText}>{lang}</Text>
                            </View>
                        ))}
                    </>
                )}
            </View>

            {/* Main Content */}
            <View style={styles.main}>
                <Text style={styles.name}>{personalInfo.name}</Text>
                <Text style={styles.title}>{personalInfo.title}</Text>

                <View style={styles.summary}>
                    <RichText html={editedContent["Summary"] || editedContent["summary"] || ""} />
                </View>

                <Text style={styles.sectionHeader}>Work Experience</Text>
                {Object.entries(editedContent)
                    .filter(([name]) => {
                        const n = name.toUpperCase();
                        return n === "EXPERIENCE" || n === "WORK EXPERIENCE";
                    })
                    .map(([_, content], i) => (
                        <View key={i} style={{ marginBottom: 15 }}>
                            <RichText html={content} />
                        </View>
                    ))}

                {/* Render any other additional sections (Education, Certifications, etc. if not already in sidebar) */}
                {Object.entries(editedContent)
                    .filter(([name]) => {
                        const n = name.toUpperCase();
                        return !["SUMMARY", "SKILLS", "CONTACT", "EXPERIENCE", "WORK EXPERIENCE", "PROJECTS"].includes(n);
                    })
                    .map(([name, content], i) => (
                        <View key={i} wrap={false} style={{ marginBottom: 15 }}>
                            <Text style={styles.sectionHeader}>{name.toUpperCase()}</Text>
                            <RichText html={content} />
                        </View>
                    ))}

                <Text style={styles.footer}>Generated by JobFit AI Optimizer</Text>
            </View>
        </Page>
    </Document>
);

export default ResumePDF;
