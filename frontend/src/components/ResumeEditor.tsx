import React from "react";
import { Textarea } from "./ui/Textarea";

interface ResumeEditorProps {
  content: string;
  onChange: (text: string) => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ content, onChange }) => {
  return (
    <div>
      <label
        htmlFor="resume-editor"
        className="block mb-2 font-medium text-gray-800"
      >
        Edit Resume Content
      </label>
      <Textarea
        id="resume-editor"
        rows={10}
        value={content}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ResumeEditor;
