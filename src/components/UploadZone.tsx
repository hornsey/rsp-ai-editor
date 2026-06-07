"use client";

import { useState, useRef } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

export default function UploadZone({
  onFileSelect,
  acceptedTypes = "image/jpeg,image/png,image/webp",
  maxSizeMB = 10,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WebP image.");
      return;
    }
    
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB.`);
      return;
    }
    
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div
      className={`upload-zone p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-surface-container-lowest ${
        isDragOver ? "border-primary bg-primary-container/5" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        className="hidden"
        onChange={handleInputChange}
      />
      
      <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: 48 }}>
        cloud_upload
      </span>
      
      <h3 className="text-xl font-semibold text-on-surface mb-1">Upload Image</h3>
      
      <p className="text-sm text-on-surface-variant">
        Drop your image here or click to upload — JPG, PNG, WebP up to {maxSizeMB}MB
      </p>
      
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
