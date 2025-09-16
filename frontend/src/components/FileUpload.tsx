// src/components/FileUpload.tsx
import { Upload } from "lucide-react";
import React, { useRef } from "react";
import { Input } from "./ui/Input";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    } else {
      onFileSelect(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <div 
        className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer transition hover:border-blue-400 hover:bg-blue-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload size={32} className="text-gray-400" />
          <p className="text-gray-600">
            Drag & drop your resume here or{" "}
            <span className="text-blue-600 font-medium">browse files</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports PDF, DOC, and DOCX files
          </p>
        </div>
      </div>
      
      <Input
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