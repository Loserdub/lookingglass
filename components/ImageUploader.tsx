import React, { useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  isAnalyzing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  selectedImage, 
  onClear,
  isAnalyzing
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-neutral-700 bg-black shadow-2xl transition-all">
        <img 
          src={URL.createObjectURL(selectedImage)} 
          alt="Analysis Target" 
          className="w-full h-96 object-contain bg-neutral-950"
        />
        {!isAnalyzing && (
          <button 
            onClick={onClear}
            className="absolute top-4 right-4 p-2 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded-full transition-colors border border-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
             <div className="flex flex-col items-center space-y-4">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
                </div>
                <p className="text-white font-mono text-sm animate-pulse tracking-widest">PROCESSING BIOMARKERS...</p>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="border border-dashed border-neutral-700 hover:border-white hover:bg-neutral-900/30 rounded-2xl p-12 transition-all cursor-pointer group flex flex-col items-center justify-center h-80 bg-neutral-950"
    >
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <div className="p-4 bg-neutral-900 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-neutral-700 group-hover:ring-white/50">
        <Upload className="h-8 w-8 text-neutral-300" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Initialize Image Ingestion</h3>
      <p className="text-neutral-500 text-sm text-center max-w-xs font-light">
        Drag and drop your high-resolution file here, or click to browse.
        <br/><span className="text-neutral-600 text-xs mt-2 block font-mono">Supported: JPEG, PNG, WEBP</span>
      </p>
    </div>
  );
};