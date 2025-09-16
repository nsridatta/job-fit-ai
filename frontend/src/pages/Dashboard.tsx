import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, FileText, Sparkles, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResume } from "../api";
import FileUpload from "../components/FileUpload";
import JobDescriptionInput from "../components/JobDescriptionInput";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-responsive py-8"
    >
      {/* Header Section */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4"
        >
          <Sparkles className="text-blue-600" size={32} />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume AI Analyzer
        </h1>
        <p className="text-gray-600">Get instant feedback on your resume's job fit</p>
      </div>

      {/* Main Card Content */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
        {/* File Upload Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Upload size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Upload Resume</h3>
          </div>
          <FileUpload onFileSelect={setResumeFile} />
          {resumeFile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 flex items-center gap-2 text-green-600"
            >
              <CheckCircle2 size={16} />
              <span className="text-sm">{resumeFile.name} uploaded successfully</span>
            </motion.div>
          )}
        </motion.div>

        {/* Job Description Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
          </div>
          <JobDescriptionInput onInputChange={setJobDescription} />
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Button with Integrated Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {/* Progress Bar (only shown when loading) */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{steps[currentStep]}</span>
                  <span>{timeElapsed}s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      duration: 30,
                      ease: "linear"
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  This usually takes 10-35 seconds...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!resumeFile || !jobDescription.trim() || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 relative"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Analyzing...</span>
                
                {/* Mini progress indicator on button */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 30, ease: "linear" }}
                />
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Analyze Resume
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Footer Information */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-gray-500 text-sm text-center"
      >
        Our AI will analyze your resume against the job description and provide tailored suggestions 
        to improve your chances of getting an interview.
      </motion.p>
    </motion.div>
  );
};

export default Dashboard;