import React, { useRef, useState } from 'react';
import { Icons } from './ui/Icons';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert('Please select an image file');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center space-y-2 mb-10 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          PixelTune <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI</span>
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Professional image toolkit. Resize, compress, and creatively transform your photos with Gemini AI.
        </p>
      </div>

      <div
        className={`w-full max-w-xl h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-6 transition-all duration-300 z-10 cursor-pointer backdrop-blur-sm
          ${isDragOver 
            ? 'border-blue-500 bg-blue-500/10 scale-105' 
            : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className={`p-4 rounded-full transition-transform duration-500 ${isDragOver ? 'bg-blue-500 text-white rotate-12' : 'bg-zinc-800 text-zinc-400'}`}>
          <Icons.Upload size={40} />
        </div>
        
        <div className="text-center space-y-1">
          <p className="text-xl font-medium text-zinc-200">
            {isDragOver ? 'Drop it here!' : 'Click or drag image to upload'}
          </p>
          <p className="text-sm text-zinc-500">Supports JPG, PNG, WEBP</p>
        </div>

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
        />
      </div>
      
      <div className="mt-12 flex gap-8 z-10 text-zinc-500 text-xs font-medium uppercase tracking-widest">
        <span className="flex items-center gap-2"><Icons.Zap size={14} /> Local Processing</span>
        <span className="flex items-center gap-2"><Icons.Sparkles size={14} /> Gemini Integration</span>
        <span className="flex items-center gap-2"><Icons.Download size={14} /> Instant Export</span>
      </div>
    </div>
  );
};

export default ImageUploader;
