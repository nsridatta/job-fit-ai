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
    }
});

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
                {(editedContent["Skills"] || editedContent["skills"] || "")
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

                <Text style={styles.summary}>
                    {editedContent["Summary"] || editedContent["summary"] || ""}
                </Text>

                <Text style={styles.sectionHeader}>Work Experience</Text>
                {Object.entries(editedContent)
                    .filter(([name]) => !["SUMMARY", "SKILLS", "CONTACT"].includes(name.toUpperCase()))
                    .map(([name, content], i) => {
                        // Extract dates if they exist in the name or content (heuristic)
                        // For a real app, you might want more structured data
                        return (
                            <View key={i} wrap={false}>
                                <View style={styles.experienceHeader}>
                                    <Text style={styles.jobTitle}>{name.toUpperCase()}</Text>
                                </View>
                                <Text style={styles.contentItem}>{content}</Text>
                            </View>
                        );
                    })}

                <Text style={styles.footer}>Generated by JobFit AI Optimizer</Text>
            </View>
        </Page>
    </Document>
);

export default ResumePDF;
