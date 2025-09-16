// src/pages/Results.tsx
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, FileText, TrendingUp } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScoreCard from "../components/ScoreCard";

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-responsive py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-full bg-surface border border-border hover:bg-gray-50 transition"
          aria-label="Go back to dashboard"
        >
          <ArrowLeft size={20} className="text-text" />
        </button>
        <h1 className="text-3xl font-bold text-text">Analysis Results</h1>
      </motion.div>

      {/* Score Cards Grid */}
      <motion.div variants={itemVariants} className="mb-8">
        <ScoreCard sections={data.sections} />
      </motion.div>

      {/* Overall Results Panel */}
      <motion.div
        variants={itemVariants}
        className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Suggestion */}
          <div>
            <h3 className="text-lg font-semibold text-text flex items-center gap-2">
              <FileText size={20} />
              Overall Suggestions
            </h3>
            <p className="mt-2 text-text leading-relaxed">{data.overallSuggestion}</p>
          </div>

          {/* Job Match Score */}
          <div>
            <h3 className="text-lg font-semibold text-text flex items-center gap-2">
              <TrendingUp size={20} />
              Job Match Score
            </h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {data.jobMatchScore}%
              </span>
              <span className="text-text-light">/100%</span>
            </div>
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="mt-6">
          <h4 className="font-medium text-text flex items-center gap-2">
            <CheckCircle size={18} />
            Keywords to Add
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.missingKeywords.map((keyword: string, index: number) => (
              <motion.span
                key={keyword}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface px-3 py-1 rounded-full text-sm text-text border border-border"
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Template Verdict */}
        <div className="mt-6 pt-4 border-t border-blue-200">
          <p className="text-sm text-text">
            <strong>Template Verdict:</strong>{" "}
            <span className="text-green-600 font-medium">{data.templateVerdict}</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Results;