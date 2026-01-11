import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import {
    PiArrowLeftBold,
    PiMagicWandBold,
    PiDownloadSimpleBold,
    PiInfoBold,
    PiUserCircleBold,
    PiMagicWandDuotone,
    PiCameraBold,
    PiTrashBold,
    PiGlobeBold,
    PiListBulletsBold,
    PiFileTextBold,
    PiChartLineUpBold,
    PiSparkleBold,
    PiMicrosoftWordLogoBold
} from "react-icons/pi";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Button } from "../components/ui/Button";
import { ColorModeButton } from "../components/ui/color-mode";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from '../components/ResumePDF';
import { generateCoverLetter, generateRoadmap } from "../api";

interface SectionData {
    score: number;
    suggestion: string;
    original: string;
    updated: string;
}

interface ResultsData {
    sections: { [key: string]: SectionData };
    overallSuggestion: string;
    jobMatchScore?: number;
    missingKeywords?: string[];
    templateVerdict: string;
}

const SectionEditor: React.FC<{
    name: string;
    content: string;
    modules: any;
    formats: any;
    onChange: (val: string) => void;
    suggestion?: string;
    onApplyAI: () => void;
    score?: number;
}> = React.memo(({ name, content, modules, formats, onChange, suggestion, onApplyAI, score }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{name}</span>
                    {score && (
                        <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                            {score}/10
                        </span>
                    )}
                </div>
                <button
                    onClick={onApplyAI}
                    className="text-[10px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors uppercase tracking-tight"
                >
                    <PiMagicWandDuotone className="w-3 h-3" />
                    Apply AI
                </button>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={(val) => {
                        if (val !== content) {
                            onChange(val);
                        }
                    }}
                    modules={modules}
                    formats={formats}
                    className="resume-quill"
                />
            </div>
            {suggestion && (
                <div className="flex gap-2 items-start p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <PiInfoBold className="w-3 h-3 text-slate-400 mt-1" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal italic">
                        {suggestion}
                    </p>
                </div>
            )}
        </div>
    );
});

const OptimizationHub: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state as ResultsData;

    const [personalInfo, setPersonalInfo] = useState({
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        profilePic: "",
        languages: ""
    });
    const [editedContent, setEditedContent] = useState<{ [key: string]: string }>({});
    const [agenticContent, setAgenticContent] = useState<{ type: 'letter' | 'roadmap' | null; content: string }>({ type: null, content: "" });
    const [isGenerating, setIsGenerating] = useState(false);
    const [showRecommendation, setShowRecommendation] = useState(true);

    // Initialize content with "clubbing" logic for mid-range scores
    useEffect(() => {
        if (data?.sections) {
            const initial: { [key: string]: string } = {};

            // Helper to get processed text for a section
            const getProcessedText = (sec: SectionData) => {
                if (sec.original && sec.original !== "No relevant section found.") {
                    if (sec.updated && sec.updated !== sec.original) {
                        return `${sec.original}\n\n--- AI RECOMMENDATION ---\n${sec.updated}`.trim();
                    }
                    return sec.original.trim();
                }
                return sec.updated || sec.original || "";
            };

            const expKey = Object.keys(data.sections).find(k => k.toUpperCase() === 'EXPERIENCE' || k.toUpperCase() === 'WORK EXPERIENCE');
            const projKey = Object.keys(data.sections).find(k => k.toUpperCase() === 'PROJECTS');

            Object.entries(data.sections).forEach(([name, sec]) => {
                // Skip project key if we are merging it into experience
                if (projKey && name === projKey) return;

                let content = getProcessedText(sec);

                // If this is the experience section and projects exist, merge them
                if (expKey && name === expKey && projKey) {
                    const projContent = getProcessedText(data.sections[projKey]);
                    if (projContent) {
                        content = `${content}\n\n${projContent}`.trim();
                    }
                }

                initial[name] = content;
            });
            setEditedContent(initial);
        }
    }, [data]);

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="text-center space-y-4">
                    <PiInfoBold className="w-16 h-16 text-blue-400 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900">Analysis Required</h2>
                    <p className="text-slate-500">Please analyze your resume first to use the Optimizer Hub.</p>
                    <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
                </div>
            </div>
        );
    }

    const handleApplyAI = (sectionName: string) => {
        const aiText = data.sections[sectionName]?.updated;
        if (aiText) {
            setEditedContent(prev => ({ ...prev, [sectionName]: aiText }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPersonalInfo(prev => ({ ...prev, profilePic: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPersonalInfo(prev => ({ ...prev, profilePic: "" }));
    };

    const handleGenerateLetter = async () => {
        if (!data || isGenerating) return;
        setIsGenerating(true);
        try {
            // Reconstruct a simplified text from edited content for the prompt
            const fullText = Object.values(editedContent).join("\n\n");
            // Simulate formData since the endpoint expects it for resumeFile part (we don't have the original file object here easily available, 
            // but we can send the text as a blob if needed, or update backend to accept text. 
            // Given the current backend implementation, it expects MultipartFile. 
            // For now, let's assume we use the original location state blob if available, or we modify backend.
            // Let's modify handleGenerateLetter to just pass the job description and let backend use a simplified text version or just generate generic.
            // Actually, better to send the current edited text.
            const blob = new Blob([fullText], { type: 'text/plain' });
            const formData = new FormData();
            formData.append("resumeFile", blob, "resume.txt");
            formData.append("jobDescription", "Current Job Context"); // In a real app, we'd store the JD in location state too

            const res = await generateCoverLetter(formData);
            setAgenticContent({ type: 'letter', content: res.content });
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateRoadmap = async () => {
        if (!data?.missingKeywords || isGenerating) return;
        setIsGenerating(true);
        try {
            const res = await generateRoadmap(data.missingKeywords.join(", "));
            setAgenticContent({ type: 'roadmap', content: res.content });
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const quillModules = React.useMemo(() => ({
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
        ],
    }), []);

    const quillFormats = React.useMemo(() => [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'link',
        'code-block',
    ], []);
    // Removed problematic global quillRef

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 flex flex-col h-screen overflow-hidden transition-colors duration-300">
            {/* Header */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-30 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500">
                        <PiArrowLeftBold className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white">Resume Optimizer Hub</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">Live PDF Preview & High-Score Editor</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ColorModeButton />
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
                    <PDFDownloadLink
                        document={<ResumePDF personalInfo={personalInfo} editedContent={editedContent} />}
                        fileName={`${personalInfo.name.replace(/\s+/g, '_') || 'Resume'}_Optimized.pdf`}
                    >
                        {({ loading }) => (
                            <Button disabled={loading || !personalInfo.name}
                                title="Add Name to download"
                                className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                                <PiDownloadSimpleBold className="w-4 h-4" />
                                {loading ? 'Preparing...' : 'Download PDF'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Editor Content */}
                <div className="w-[480px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar flex flex-col shadow-sm">
                    <div className="p-6 space-y-8">
                        {/* Agentic Chain Recommendations */}
                        {showRecommendation && (data?.jobMatchScore || 0) > 0 && (
                            <section className="animate-in fade-in slide-in-from-top duration-500 relative group">
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
                                    <button
                                        onClick={() => setShowRecommendation(false)}
                                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Dismiss recommendation"
                                    >
                                        <PiTrashBold className="w-3.5 h-3.5" />
                                    </button>

                                    <div className="flex items-center gap-2 mb-3">
                                        <PiSparkleBold className="w-5 h-5 text-indigo-500" />
                                        <h3 className="font-bold text-slate-900">Smart Recommendation</h3>
                                    </div>

                                    {(data?.jobMatchScore || 0) >= 70 ? (
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                Great match! Your score of <strong>{data?.jobMatchScore}%</strong> suggests you're a strong candidate.
                                                Want to generate a tailored cover letter to seal the deal?
                                            </p>
                                            <Button
                                                onClick={handleGenerateLetter}
                                                disabled={isGenerating}
                                                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9"
                                            >
                                                <PiFileTextBold className="w-4 h-4" />
                                                {isGenerating ? "Generating..." : "Generate Matching Cover Letter"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                You're close, but missing some key skills like <strong>{data?.missingKeywords?.slice(0, 2).join(", ")}</strong>.
                                                Generate a 3-day roadmap to bridge the gap?
                                            </p>
                                            <Button
                                                onClick={handleGenerateRoadmap}
                                                disabled={isGenerating}
                                                className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs h-9"
                                            >
                                                <PiChartLineUpBold className="w-4 h-4" />
                                                {isGenerating ? "Generating..." : "Create 3-Day Skill Roadmap"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Agentic Result Display */}
                        {agenticContent.type && (
                            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm animate-in zoom-in duration-300">
                                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <PiMagicWandBold className="w-4 h-4 text-blue-500" />
                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                            {agenticContent.type === 'letter' ? 'Drafted Cover Letter' : 'Skill Roadmap'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setAgenticContent({ type: null, content: "" })}
                                        className="text-slate-400 hover:text-slate-600 p-1"
                                    >
                                        <PiTrashBold className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50">
                                    <pre className="text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed italic">
                                        {agenticContent.content}
                                    </pre>
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                                        <Button
                                            onClick={() => navigator.clipboard.writeText(agenticContent.content)}
                                            className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs h-9"
                                        >
                                            Copy to Clipboard
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        )}
                        <section className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
                                <PiUserCircleBold className="w-5 h-5 text-blue-500" />
                                <h3 className="font-bold">Contact Details</h3>
                            </div>

                            {/* Profile Pic Upload */}
                            <div className="mb-8 flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-blue-400 dark:group-hover:border-blue-500 group-hover:bg-blue-50/30 dark:group-hover:bg-blue-900/10 group-hover:shadow-xl group-hover:shadow-blue-500/10">
                                        {personalInfo.profilePic ? (
                                            <img src={personalInfo.profilePic} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <PiCameraBold className="w-8 h-8 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                        )}
                                    </div>

                                    {personalInfo.profilePic ? (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute -top-1 -right-1 p-2 bg-white dark:bg-slate-800 text-red-500 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all hover:scale-110 z-10 border border-slate-100 dark:border-slate-700"
                                            title="Remove image"
                                        >
                                            <PiTrashBold className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <label className="absolute inset-0 cursor-pointer">
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">Upload Photo</span>
                                            </div>
                                        </label>
                                    )}
                                </div>
                                {!personalInfo.profilePic && (
                                    <div className="text-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Profile Photo</span>
                                        <p className="text-[9px] text-slate-400 dark:text-slate-500 italic">Recommended: Square image</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                                        value={personalInfo.name}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Professional Title"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                                        value={personalInfo.title}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                                        value={personalInfo.email}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                                        value={personalInfo.phone}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="LinkedIn URL"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                                        value={personalInfo.linkedin}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="GitHub URL"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                                        value={personalInfo.github}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Location (City, Country)"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                                        value={personalInfo.location}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                                    />
                                    <div className="relative">
                                        <PiGlobeBold className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Languages"
                                            className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                                            value={personalInfo.languages}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, languages: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Resume Sections */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                                <PiMagicWandBold className="w-5 h-5 text-purple-500" />
                                <h3 className="font-bold">Content Editor</h3>
                            </div>

                            {Object.entries(editedContent).map(([name, content]) => (
                                <SectionEditor
                                    key={name}
                                    name={name}
                                    content={content}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    onChange={(val) => setEditedContent(prev => ({ ...prev, [name]: val }))}
                                    suggestion={data.sections[name]?.suggestion}
                                    onApplyAI={() => handleApplyAI(name)}
                                    score={data.sections[name]?.score}
                                />
                            ))}
                        </section>
                    </div>
                </div>

                {/* Right Panel - Live Preview */}
                <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-8 flex flex-col items-center justify-center overflow-hidden relative">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Real-time Preview</span>
                    </div>

                    <div className="w-full h-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-white dark:border-slate-800">
                        <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none">
                            <ResumePDF personalInfo={personalInfo} editedContent={editedContent} />
                        </PDFViewer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptimizationHub;
