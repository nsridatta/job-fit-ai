// src/pages/Results.tsx
import { motion } from "framer-motion";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  PiArrowLeftBold,
  PiCheckCircleFill,
  PiLightbulbDuotone,
  PiTrendUpBold,
  PiTagDuotone,
  PiMagicWandDuotone,
  PiShieldCheckDuotone,
  PiStarDuotone,
  PiWarningCircleBold
} from "react-icons/pi";
import { Button } from "../components/ui/Button";

interface SectionData {
  score: number;
  suggestion: string;
  updated: string;
}

interface ResultsData {
  sections: { [key: string]: SectionData };
  overallSuggestion: string;
  jobMatchScore: number;
  missingKeywords: string[];
  templateVerdict: string;
}

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as ResultsData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-primary";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number): string => {
    if (score >= 80) return "bg-primary/10 border-primary/20";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getScoreRingColor = (score: number): string => {
    if (score >= 80) return "#00c091";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  // SVG Circle progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data?.jobMatchScore / 100) * circumference;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="text-center space-y-4">
          <PiWarningCircleBold className="w-16 h-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">No Results Found</h2>
          <p className="text-slate-500">Please go back and analyze a resume first.</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white selection:bg-primary/20 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fafafa]">
        <div className="bg-blur-blob w-[500px] h-[500px] bg-emerald-100/50 -top-20 -right-20" />
        <div className="bg-blur-blob w-[400px] h-[400px] bg-blue-100/40 bottom-20 -left-20" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              aria-label="Go back"
            >
              <PiArrowLeftBold className="w-5 h-5 text-slate-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <PiMagicWandDuotone className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Analysis Results
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate("/dashboard")}>
            Analyze Another
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
        >
          {/* Hero Score Section */}
          <motion.section variants={itemVariants} className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Main Score Card */}
            <div className="lg:col-span-1 bg-white rounded-[2rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20" />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Job Match Score</p>
                <div className="relative w-40 h-40 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r={radius} fill="none"
                      stroke={getScoreRingColor(data.jobMatchScore)}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: "stroke-dashoffset 1s ease-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-5xl font-black ${getScoreColor(data.jobMatchScore)}`}>
                      {data.jobMatchScore}%
                    </span>
                  </div>
                </div>
                <p className="mt-6 text-slate-500 text-sm">
                  {data.jobMatchScore >= 80 ? "Excellent match! Your resume is well-aligned." :
                    data.jobMatchScore >= 60 ? "Good start. Some improvements recommended." :
                      "Needs work. Follow the suggestions below."}
                </p>
              </div>
            </div>

            {/* Insights Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Suggestion */}
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-100/50 border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
                    <PiLightbulbDuotone className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Key Recommendation</h3>
                    <p className="text-slate-600 leading-relaxed">{data.overallSuggestion}</p>
                  </div>
                </div>
              </div>

              {/* Template Verdict */}
              <div className={`rounded-3xl p-6 border ${data.templateVerdict.toLowerCase().includes('good') || data.templateVerdict.toLowerCase().includes('ats') ? 'bg-primary/5 border-primary/20' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${data.templateVerdict.toLowerCase().includes('good') || data.templateVerdict.toLowerCase().includes('ats') ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-600'}`}>
                    <PiShieldCheckDuotone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Template Verdict</p>
                    <p className={`text-lg font-bold ${data.templateVerdict.toLowerCase().includes('good') || data.templateVerdict.toLowerCase().includes('ats') ? 'text-primary' : 'text-amber-600'}`}>
                      {data.templateVerdict}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Advisor CTA - Only for Partial Matches */}
            {data.jobMatchScore > 0 && data.jobMatchScore < 55 && (
              <motion.div
                variants={itemVariants}
                className="lg:col-span-3 bg-gradient-to-r from-primary/10 via-violet-50 to-blue-50 rounded-[2rem] p-8 border border-primary/20 shadow-xl relative overflow-hidden group mt-8"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                      <PiMagicWandDuotone className="w-4 h-4" />
                      Optimizer Available
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">
                      Bridge the Gap to <span className="text-primary italic">95%+ Match</span>
                    </h2>
                    <p className="text-slate-600 leading-relaxed max-w-2xl">
                      Our AI has identified specific skills and phrases that can boost your score instantly.
                      Use our free Optimizer Hub to generate a perfectly matched, ATS-ready resume in seconds.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Button
                      size="xl"
                      onClick={() => navigate("/optimizer", { state: data })}
                      className="bg-primary hover:bg-primary-dark shadow-xl hover:shadow-primary/30 group py-6 px-12"
                    >
                      Open Optimizer Hub
                      <PiTrendUpBold className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>

          {/* Missing Keywords */}
          <motion.section variants={itemVariants}>
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-100/50 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
                  <PiTagDuotone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Keywords to Add</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {data.missingKeywords.map((keyword, index) => (
                  <motion.span
                    key={keyword}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors cursor-default"
                  >
                    + {keyword}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Section Scores Grid */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-violet-100 rounded-xl text-violet-600">
                <PiStarDuotone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Section-by-Section Analysis</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(data.sections).map(([name, sectionData], index) => {
                const sectionScore = sectionData.score * 10; // Assuming score is 0-10, convert to percentage
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-100/50 border border-slate-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-bold text-slate-900 capitalize">{name.toLowerCase()}</h4>
                      <span className={`text-2xl font-black ${getScoreColor(sectionScore)}`}>
                        {sectionData.score}/10
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sectionScore}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: getScoreRingColor(sectionScore) }}
                      />
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <PiLightbulbDuotone className="w-4 h-4 text-amber-500" /> Suggestion
                        </p>
                        <p className="text-slate-500 mt-1 leading-relaxed">{sectionData.suggestion}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <PiCheckCircleFill className="w-4 h-4 text-primary" /> Improved Version
                        </p>
                        <p className="text-slate-500 mt-1 leading-relaxed">{sectionData.updated}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Footer CTA */}
          <motion.section variants={itemVariants} className="text-center pt-8">
            <Button size="xl" onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary-dark">
              Analyze Another Resume
            </Button>
          </motion.section>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-slate-50/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PiMagicWandDuotone className="text-primary w-5 h-5" />
            <span className="text-lg font-bold text-slate-900">JobFit AI</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 JobFit AI. Your data is never stored.</p>
        </div>
      </footer>
    </div>
  );
};

export default Results;