import { motion } from "framer-motion";
import React from "react";

interface ScoreCardProps {
  sections: {
    [key: string]: {
      score: number;
      suggestion: string;
      updated: string;
    };
  };
}

const ScoreCard: React.FC<ScoreCardProps> = ({ sections }) => {
  if (!sections || Object.keys(sections).length === 0) {
    return (
      <div className="text-red-800 bg-red-100 p-4 rounded-xl border border-red-300 text-sm md:text-base text-center">
        No analysis data available.
      </div>
    );
  }

  const calculateCircumference = (radius: number) => 2 * Math.PI * radius;
  const radius = 20; // Reduced radius for smaller circle
  const circumference = calculateCircumference(radius);

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "text-green-600";
    if (score >= 5) return "text-amber-600";
    return "text-red-600";
  };

  const getStrokeColor = (score: number): string => {
    if (score >= 8) return "#10B981"; // Green-500
    if (score >= 5) return "#F59E0B"; // Amber-500
    return "#EF4444"; // Red-500
  };

  return (
    <div className="card-grid">
      {Object.entries(sections).map(([name, data], index) => {
        const percentage = (data.score / 10) * 100;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;
        const strokeColor = getStrokeColor(data.score);

        return (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card w-full max-w-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Header with Score */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize text-left flex-1">
                {name.toLowerCase()}
              </h3>
              
              {/* Circular Progress Indicator */}
              <div className="circular-progress-container">
                <svg className="circular-progress" viewBox="0 0 48 48">
                  <circle
                    className="circular-progress-bg"
                    cx="24"
                    cy="24"
                    r={radius}
                  />
                  <circle
                    className="circular-progress-fill"
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke={strokeColor}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="circular-progress-text">
                  <span className={getScoreColor(data.score)}>
                    {data.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3 text-left">
              <div>
                <p className="text-sm font-medium text-gray-700">Suggestion:</p>
                <p className="text-sm text-gray-600 mt-1">{data.suggestion}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">Updated:</p>
                <p className="text-sm text-gray-600 mt-1">{data.updated}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ScoreCard;