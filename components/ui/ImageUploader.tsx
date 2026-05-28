'use client';

import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, X, Edit2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 200;
        const MAX_HEIGHT = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to 80% quality JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onChange(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (value) {
    return (
      <div className="flex items-center gap-6">
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={triggerFileSelect}
            className="flex items-center gap-2 text-sm font-medium text-primary-green bg-primary-light/20 px-4 py-2 rounded-lg hover:bg-primary-light/40 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Change Picture
          </button>
          <button
            type="button"
            onClick={() => onChange('')}
            className="flex items-center gap-2 text-sm font-medium text-danger hover:text-red-700 px-4 py-1 transition-colors"
          >
            <X className="w-4 h-4" />
            Remove
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          ref={fileInputRef}
        />
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-primary-green bg-primary-light/10' : 'border-border hover:border-primary-green/50 hover:bg-surface'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        ref={fileInputRef}
      />
      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
        <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-primary-green' : 'text-text-muted'}`} />
        <span className="text-sm font-medium text-text-primary">
          Click to upload or drag and drop
        </span>
        <span className="text-xs text-text-secondary">SVG, PNG, JPG or GIF (max. 800x400px)</span>
      </label>
    </div>
  );
}
