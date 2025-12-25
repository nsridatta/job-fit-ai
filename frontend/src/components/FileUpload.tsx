// src/components/FileUpload.tsx
import { PiCloudArrowUpDuotone, PiShieldCheckDuotone } from "react-icons/pi";
import React, { useRef, useState } from "react";
import { Input } from "./ui/Input";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    } else {
      onFileSelect(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300
          ${isDragOver
            ? 'border-primary bg-primary/5 scale-[0.99]'
            : 'border-slate-200 hover:border-primary/50 bg-white hover:bg-slate-50/50'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="space-y-2">
            <p className="text-slate-600 font-medium text-base">
              Drop your resume here or choose a file.
            </p>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-tight">
              PDF only. Max 5MB file size.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Upload Your Resume
          </button>

          <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <PiShieldCheckDuotone className="w-3.5 h-3.5 text-slate-400" />
            Privacy guaranteed
          </p>
        </div>
      </div>

      <input
        id="resume-upload"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;