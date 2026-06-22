"use client";

import { useId, useState, useRef, type KeyboardEvent } from "react";

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
  const inputId = useId();
  const acceptedMimeTypes = acceptedTypes.split(",").map((type) => type.trim()).filter(Boolean);

  const handleFile = (file: File) => {
    setError(null);
    
    // Validate file type
    if (!acceptedMimeTypes.includes(file.type)) {
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
    e.target.value = "";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
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
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Upload image file"
    >
      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        className="sr-only"
        onChange={handleInputChange}
      />
      
      <span className="material-symbols-outlined text-primary mb-2" style={{ fontSize: 48 }}>
        cloud_upload
      </span>
      
      <h3 className="text-xl font-semibold text-on-surface mb-1">Upload Image</h3>
      
      <p className="text-sm text-on-surface-variant">
        Drop your image here or click to upload — JPG, PNG, WebP up to {maxSizeMB}MB
      </p>

      <label
        htmlFor={inputId}
        onClick={(e) => e.stopPropagation()}
        className="primary-button mt-4 cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">upload</span>
        Click to Upload
      </label>
      
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  );
}
