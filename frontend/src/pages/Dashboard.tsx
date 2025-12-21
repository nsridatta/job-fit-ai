import { AnimatePresence, motion } from "framer-motion";
import {
  PiMagicWandDuotone,
  PiCloudArrowUpDuotone,
  PiNotePencilDuotone,
  PiCheckCircleFill,
  PiWarningCircleBold,
  PiArrowRightBold,
  PiSpinnerGapBold,
  PiShieldCheckDuotone,
  PiFingerprintDuotone,
  PiDatabaseDuotone,
  PiScrollDuotone,
  PiKeyDuotone,
  PiMagnifyingGlassDuotone
} from "react-icons/pi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { analyzeResume } from "../api";
import FileUpload from "../components/FileUpload";
import JobDescriptionInput from "../components/JobDescriptionInput";
import { Button } from "../components/ui/Button";
import { PiRocketLaunchBold } from "react-icons/pi";

const Dashboard: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Steps for the progress indicator
  const steps = [
    "Uploading resume...",
    "Analyzing content...",
    "Matching with job description...",
    "Generating recommendations...",
    "Finalizing results..."
  ];

  // Effect for rotating through steps during loading
  useEffect(() => {
    let stepInterval: number;
    if (isLoading) {
      stepInterval = window.setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 5000);
    }
    return () => clearInterval(stepInterval);
  }, [isLoading, steps.length]);

  // Effect for tracking time elapsed during loading
  useEffect(() => {
    let timer: number;
    if (isLoading) {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload a resume and paste a job description.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await analyzeResume(formData);
      navigate("/results", { state: response });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen w-full bg-white selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fafafa]">
        <div className="bg-blur-blob w-[500px] h-[500px] bg-blue-100/40 -top-20 -left-20" />
        <div className="bg-blur-blob w-[600px] h-[600px] bg-emerald-100/40 -bottom-40 -right-20" />
        <div className="bg-blur-blob w-[400px] h-[400px] bg-violet-100/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Modern Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <PiMagicWandDuotone className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              JobFit AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Resume Tips</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">How it works</a>
            <Button variant="secondary" size="sm">Sign In</Button>
            <Button size="sm" className="bg-primary hover:bg-primary-dark">Get Started</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-20 items-center"
        >
          {/* Hero Section */}
          <div className="space-y-4">
            <motion.div variants={itemVariants}>
              <span className="inline-block px-1 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                Free ATS Resume Checker for aspiring professionals
              </span>
              <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Is your resume <br />
                <span className="text-primary italic">good enough?</span>
              </h1>
            </motion.div>

            <motion.p variants={itemVariants} className="text-xl text-slate-500 leading-relaxed max-w-xl">
              Our advanced AI analyzes your resume against 16 crucial criteria to ensure you land the interview you deserve. Get instant results in seconds.
            </motion.p>

            {/* Input Dashboard Card */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />

                <div className="space-y-8 relative">
                  {/* File Upload Area */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <PiCloudArrowUpDuotone className="text-primary w-5 h-5" />
                      Step 1: Upload CV
                    </label>
                    <FileUpload onFileSelect={setResumeFile} />
                    {resumeFile && (
                      <div className="flex items-center gap-2 text-primary font-medium text-sm animate-in fade-in slide-in-from-bottom-2">
                        <PiCheckCircleFill className="w-4 h-4" />
                        File ready: {resumeFile.name}
                      </div>
                    )}
                  </div>

                  {/* Job Area */}
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <PiNotePencilDuotone className="text-indigo-500 w-5 h-5" />
                      Step 2: Paste Job Description
                    </label>
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                      <JobDescriptionInput onInputChange={setJobDescription} />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-4 pt-4">
                    <Button
                      size="xl"
                      onClick={handleAnalyze}
                      isLoading={isLoading}
                      disabled={!resumeFile || !jobDescription.trim()}
                      className="w-full bg-primary hover:bg-primary-dark shadow-xl hover:shadow-primary/30 text-lg py-6"
                    >
                      Analyze My Resume
                    </Button>
                    <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <PiFingerprintDuotone className="w-4 h-4" />
                      Privacy priority. We don't store your data.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Section: Visual Preview */}
          <motion.div variants={itemVariants} className="hidden lg:block relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 via-violet-100 to-blue-100 rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="relative bg-white rounded-[2.5rem] shadow-3xl shadow-slate-200 border border-slate-100 overflow-hidden transform group rotate-2 hover:rotate-0 transition-all duration-700">
              <div className="h-12 bg-slate-50/80 border-b border-slate-100 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400/50" />
                <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/50" />
              </div>

              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-slate-100 rounded-full" />
                    <div className="w-48 h-8 bg-slate-900/5 rounded-2xl" />
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin duration-3000 flex items-center justify-center">
                    <span className="text-xl font-black text-primary">85%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                        {i === 1 ? <PiCheckCircleFill /> : <PiNotePencilDuotone />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-3 bg-slate-200 rounded-full" />
                        <div className="w-1/2 h-2 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                  <PiScrollDuotone className="w-6 h-6" />
                </div>
                <div className="pr-4">
                  <p className="text-xs font-bold text-slate-900">ATS Compatible</p>
                  <p className="text-[10px] text-slate-500 text-nowrap">Industry Standard format</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* SEO/Feature Grid */}
        <motion.section variants={itemVariants} className="mt-32 grid md:grid-cols-3 gap-12 text-center md:text-left">
          {[
            {
              title: "Free Resume Checker",
              desc: "Get institutional-grade analysis without the institutional cost. Land more interviews.",
              icon: <PiMagicWandDuotone className="w-8 h-8 text-primary" />
            },
            {
              title: "ATS Optimization",
              desc: "Ensure your resume passes through 99% of Applicant Tracking Systems globally.",
              icon: <PiScrollDuotone className="w-8 h-8 text-blue-500" />
            },
            {
              title: "Data Secure",
              desc: "Your resume is processed but never stored. We respect your privacy & data rights.",
              icon: <PiShieldCheckDuotone className="w-8 h-8 text-emerald-500" />
            }
          ].map((feature, i) => (
            <div key={i} className="space-y-4 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
              <div className="bg-white inline-block p-4 rounded-2xl shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.section>
      </main>

      {/* Modern Simple Footer */}
      <footer className="border-t border-gray-100 bg-slate-50/50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <PiMagicWandDuotone className="text-primary w-5 h-5 transition-all" />
            <span className="text-lg font-bold text-slate-900">JobFit AI</span>
          </div>
          <div className="flex gap-10 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Blog</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
          <p className="text-xs text-slate-400">© 2025 JobFit AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;