'use client';

import { useState, useRef } from 'react';
import { uploadPDF } from '@/lib/api';

interface PDFUploaderProps {
  onUploadSuccess: (documentId: string, filename: string) => void;
}

export default function PDFUploader({ onUploadSuccess }: PDFUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('PLEASE UPLOAD A PDF FILE');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadPDF(file);
      onUploadSuccess(result.documentId, result.filename);
    } catch (err) {
      setError(err instanceof Error ? err.message.toUpperCase() : 'FAILED TO UPLOAD PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border p-12 text-center transition-colors ${
          dragActive
            ? 'border-[#89CFF0]/70 bg-[#89CFF0]/10'
            : 'border-[#89CFF0]/40 bg-[#161b2e]'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''} pixel-border`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-8">
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-8 py-4 border border-[#89CFF0] bg-[#89CFF0] text-[#0a0e1a] text-xs font-bold pixel-button hover:bg-[#A7C7E7] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'UPLOADING...' : 'SELECT PDF FILE'}
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-[#5B9BD5] text-[10px]">
              OR DRAG AND DROP A PDF FILE HERE
            </p>
            {uploading && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[#89CFF0] animate-pulse"></div>
                <div className="w-2 h-2 bg-[#89CFF0] animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-[#89CFF0] animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-[#ff0000]/10 border border-[#ff0000]/50 pixel-border">
          <p className="text-[10px] text-[#ff0000]">{error}</p>
        </div>
      )}
    </div>
  );
}
