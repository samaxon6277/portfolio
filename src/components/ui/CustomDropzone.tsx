import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';

export interface CustomDropzoneProps {
  id?: string;
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  label?: string;
  sublabel?: string;
  allowedFormatsText?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomDropzone({
  id,
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeBytes = 25 * 1024 * 1024, // 25MB default
  label = 'Drag and drop your files here',
  sublabel = 'or click to browse from device',
  allowedFormatsText = 'PNG, JPG, WEBP up to 25MB',
  disabled = false,
  className = ''
}: CustomDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndEmit = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    const filesArray = Array.from(fileList);

    for (const file of filesArray) {
      if (file.size > maxSizeBytes) {
        const mbLimit = (maxSizeBytes / (1024 * 1024)).toFixed(0);
        setErrorMessage(`"${file.name}" exceeds the maximum ${mbLimit}MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    validateAndEmit(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndEmit(e.target.files);
    // Reset so same file can be re-uploaded if cleared
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-2 text-left">
      <div
        id={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-300 cursor-pointer select-none overflow-hidden ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-neutral-100 border-neutral-300'
            : isDragOver
            ? 'border-[#D6B46A] bg-[#FAF6F0] shadow-[0_0_24px_rgba(214,180,106,0.3)] scale-[1.01]'
            : 'border-[#D6B46A]/30 hover:border-[#D6B46A] bg-[#FFFDF8] hover:bg-[#FAF6F0]/60 shadow-sm'
        } ${className}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="sr-only"
        />

        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#D6B46A]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-3.5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
            isDragOver
              ? 'bg-[#D6B46A] text-[#111111] border-[#D6B46A] scale-110'
              : 'bg-[#111111] text-[#D6B46A] border-[#D6B46A]/30 shadow-md'
          }`}>
            {isDragOver ? (
              <FileUp className="w-7 h-7 animate-bounce" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-[#111111]">
              {label}
            </p>
            <p className="text-xs text-[#8A8178]">
              {sublabel}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111111]/5 border border-[#D6B46A]/20 rounded-full text-[10px] font-mono font-bold text-[#85641C] uppercase tracking-wider">
            {allowedFormatsText}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
