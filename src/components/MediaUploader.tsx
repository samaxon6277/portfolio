import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Video, File, Loader } from "lucide-react";
import ImageCropper from "./ImageCropper";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "motion/react";

interface MediaUploaderProps {
  value?: string;
  onUploadSuccess: (url: string, data?: any) => void;
  onUploadError?: (error: string) => void;
  onClear?: () => void;
  accept?: Record<string, string[]>;
  maxSizeInMB?: number;
  aspectRatio?: number; // If provided, prompts cropping for images
  folder?: string;
  buttonText?: string;
  className?: string;
}

export default function MediaUploader({
  value,
  onUploadSuccess,
  onUploadError,
  onClear,
  accept,
  maxSizeInMB = 10,
  aspectRatio,
  folder = "media-library",
  buttonText = "Upload Media",
  className = ""
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // Crop state
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const uploadToSupabase = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setErrorDetails(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("User must be authenticated to upload media.");
      }

      setProgress(30);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('media-library') // Assuming we use a unified bucket 'media-library'
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }
      setProgress(60);

      const { data: publicData } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;

      // Save to Supabase Media Table
      await supabase.from('media').insert({
        file_name: file.name,
        public_url: publicUrl,
        storage_path: filePath,
        media_type: file.type,
        size: file.size,
        bucket_name: 'media-library',
        uploaded_by: session.user.id,
        tags: [],
      });

      setProgress(100);
      onUploadSuccess(publicUrl, { ...data, secure_url: publicUrl });

    } catch (err: any) {
      console.error("Upload error:", err);
      let msg = err.message || "Network error or permission issue during upload.";
      setErrorDetails(msg);
      onUploadError?.(msg);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setErrorDetails(null);
    const file = acceptedFiles[0]; 
    
    // Validation
    const ext = file.name.split('.').pop()?.toLowerCase() || "";
    const isExe = ['exe', 'bat', 'sh', 'php', 'js'].includes(ext);
    if (isExe) {
        const msg = "Executables are not allowed.";
        setErrorDetails(msg);
        onUploadError?.(msg);
        return;
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
        const msg = `File size exceeds ${maxSizeInMB}MB.`;
        setErrorDetails(msg);
        onUploadError?.(msg);
        return;
    }

    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setCropImageSrc(reader.result?.toString() || null);
            setPendingFile(file);
        });
        reader.readAsDataURL(file);
        return;
    }

    uploadToSupabase(file);
  }, [aspectRatio, maxSizeInMB]);

  const handleCropComplete = async (croppedFile: File) => {
    setCropImageSrc(null);
    setPendingFile(null);
    
    const finalFile = new File([croppedFile], pendingFile?.name || "cropped-image.jpg", { type: "image/jpeg" });
    
    await uploadToSupabase(finalFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
      onDrop, 
      accept,
      maxFiles: 1
  } as any);

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden bg-[#101010] border border-white/10 aspect-video flex-shrink-0 flex items-center justify-center">
          {value.match(/\.(mp4|webm)$/i) ? (
             <video src={value} controls className="w-full h-full object-contain" />
          ) : value.match(/\.(pdf)$/i) ? (
             <File className="w-12 h-12 text-[#A8AFBD]" />
          ) : (
             <img src={value} alt="Uploaded Media" className="w-full h-full object-cover" />
          )}
          
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
             <button 
                type="button"
                onClick={onClear}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                title="Remove Media"
             >
                <X className="w-5 h-5" />
             </button>
             <div {...getRootProps()} className="cursor-pointer bg-[#2984FF] hover:bg-[#2984FF]/90 text-white p-2 rounded-lg transition-colors">
                <input {...getInputProps()} />
                <Upload className="w-5 h-5" />
             </div>
          </div>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer text-center group ${isDragActive ? 'border-[#2984FF] bg-[#2984FF]/5' : errorDetails ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20 bg-[#101010]'}`}
        >
          <input {...getInputProps()} disabled={isUploading} />
          
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-3">
               <Loader className="w-8 h-8 text-[#2984FF] animate-spin" />
               <div className="text-sm font-medium text-white">Uploading... {progress}%</div>
               <div className="w-full max-w-[200px] h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                 <div className="h-full bg-[#2984FF] transition-all duration-300" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
               <div className="w-12 h-12 bg-white/5 group-hover:bg-[#2984FF]/10 text-[#A8AFBD] group-hover:text-[#2984FF] rounded-full flex items-center justify-center transition-colors">
                 <Upload className="w-6 h-6" />
               </div>
               <p className="text-sm font-medium text-white">{buttonText}</p>
               <p className="text-xs text-[#A8AFBD]">Drag & drop or click to select</p>
               {errorDetails && (
                 <p className="text-xs text-red-500 mt-2 p-2 bg-red-500/10 rounded-lg">{errorDetails}</p>
               )}
            </div>
          )}
        </div>
      )}

      {/* Cropper Modal */}
      {cropImageSrc && (
        <ImageCropper 
          imageSrc={cropImageSrc}
          aspectRatio={aspectRatio}
          onCropComplete={handleCropComplete}
          onCancel={() => { setCropImageSrc(null); setPendingFile(null); }}
        />
      )}
    </div>
  );
}
