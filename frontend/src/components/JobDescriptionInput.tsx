import React from "react";
import { Textarea } from "./ui/Textarea";

interface JobDescriptionInputProps {
  onInputChange: (text: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onInputChange }) => {
  return (
    <div className="w-full">
      <Textarea
        rows={12}
        className="w-full min-h-[300px] md:min-h-[400px] lg:min-h-[450px] border-0 bg-transparent p-5 text-slate-700 placeholder:text-slate-400 focus:ring-0 text-base md:text-lg leading-relaxed resize-y transition-all"
        placeholder="Paste the job description here...

Example:
• 3+ years of experience with React
• Bachelor's degree in Computer Science
• Experience with cloud platforms like AWS"
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
};

export default JobDescriptionInput;