import React from "react";
import { Textarea } from "./ui/Textarea";

interface JobDescriptionInputProps {
  onInputChange: (text: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onInputChange }) => {
  return (
    <div className="flex justify-center">
      <Textarea
        className="border border-gray-300 rounded-xl 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent transition 
                   resize-none text-base leading-6"
        placeholder="Paste the job description here...
        
Example:
• 3+ years of experience with React
• Bachelor's degree in Computer Science
• Experience with cloud platforms like AWS
• Strong communication skills"
style={{ width: '739px', height: '178px' }}
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  );
};

export default JobDescriptionInput;