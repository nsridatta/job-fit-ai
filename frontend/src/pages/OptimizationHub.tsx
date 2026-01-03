import React, { useState, useEffect } from "react";
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
    PiGlobeBold
} from "react-icons/pi";
import { Button } from "../components/ui/Button";
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from '../components/ResumePDF';

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

    // Initialize content with "clubbing" logic for mid-range scores
    useEffect(() => {
        if (data?.sections) {
            const initial: { [key: string]: string } = {};
            Object.entries(data.sections).forEach(([name, sec]) => {
                // If original exists (40-65 range), club them if they are different
                if (sec.original && sec.original !== "No relevant section found.") {
                    if (sec.updated && sec.updated !== sec.original) {
                        initial[name] = `${sec.original}\n\n--- AI RECOMMENDATION ---\n${sec.updated}`.trim();
                    } else {
                        initial[name] = sec.original.trim();
                    }
                } else {
                    // High score (>8 section) or Low score/No original provided
                    initial[name] = sec.updated || sec.original || "";
                }
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

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <PiArrowLeftBold className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-slate-900">Resume Optimizer Hub</h1>
                        <p className="text-xs text-slate-500 italic">Live PDF Preview & High-Score Editor</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
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
                <div className="w-[480px] border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar flex flex-col shadow-sm">
                    <div className="p-6 space-y-8">
                        {/* Personal Info */}
                        <section className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-4 text-slate-900">
                                <PiUserCircleBold className="w-5 h-5 text-blue-500" />
                                <h3 className="font-bold">Contact Details</h3>
                            </div>

                            {/* Profile Pic Upload */}
                            <div className="mb-8 flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-slate-200 bg-white flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-blue-400 group-hover:bg-blue-50/30 group-hover:shadow-xl group-hover:shadow-blue-500/10">
                                        {personalInfo.profilePic ? (
                                            <img src={personalInfo.profilePic} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <PiCameraBold className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                        )}
                                    </div>

                                    {personalInfo.profilePic ? (
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute -top-1 -right-1 p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-all hover:scale-110 z-10 border border-slate-100"
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
                                        <p className="text-[9px] text-slate-400 italic">Recommended: Square image</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-3">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        value={personalInfo.name}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Professional Title"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        value={personalInfo.title}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        value={personalInfo.email}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        value={personalInfo.phone}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="LinkedIn URL"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        value={personalInfo.linkedin}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="GitHub URL"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        value={personalInfo.github}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Location (City, Country)"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        value={personalInfo.location}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                                    />
                                    <div className="relative">
                                        <PiGlobeBold className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Languages"
                                            className="w-full pl-9 p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            value={personalInfo.languages}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, languages: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Resume Sections */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-2">
                                <PiMagicWandBold className="w-5 h-5 text-purple-500" />
                                <h3 className="font-bold">Content Editor</h3>
                            </div>

                            {Object.entries(editedContent).map(([name, content]) => (
                                <div key={name} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{name}</span>
                                            {data.sections[name]?.score && (
                                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                                                    {data.sections[name].score}/10
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleApplyAI(name)}
                                            className="text-[10px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors uppercase tracking-tight"
                                        >
                                            <PiMagicWandDuotone className="w-3 h-3" />
                                            Apply AI
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-full h-32 p-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none leading-relaxed bg-[#fcfcfc]"
                                        value={content}
                                        onChange={(e) => setEditedContent({ ...editedContent, [name]: e.target.value })}
                                    />
                                    {data.sections[name]?.suggestion && (
                                        <div className="flex gap-2 items-start p-3 bg-slate-50 rounded-xl">
                                            <PiInfoBold className="w-3 h-3 text-slate-400 mt-1" />
                                            <p className="text-[11px] text-slate-500 leading-normal italic">
                                                {data.sections[name].suggestion}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </section>
                    </div>
                </div>

                {/* Right Panel - Live Preview */}
                <div className="flex-1 bg-slate-100 p-8 flex flex-col items-center justify-center overflow-hidden relative">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Real-time Preview</span>
                    </div>

                    <div className="w-full h-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-white">
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
