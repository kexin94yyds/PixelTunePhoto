import React, { useState, useEffect, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import EditorSidebar from './components/EditorSidebar';
import Workspace from './components/Workspace';
import { ImageState, ProcessingOptions, Tab } from './types';
import { readFileAsDataURL, processImage, loadImage } from './utils/imageUtils';
import { editImageWithGemini, analyzeImageSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ADJUST);
  
  // Image State
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    originalPreviewUrl: null,
    processedPreviewUrl: null,
    originalWidth: 0,
    originalHeight: 0,
    processedWidth: 0,
    processedHeight: 0,
    fileSize: 0,
    processedSize: null,
  });

  // Editor Options
  const [options, setOptions] = useState<ProcessingOptions>({
    width: 0,
    height: 0,
    maintainAspectRatio: true,
    quality: 90,
    format: 'image/jpeg',
    scale: 100
  });

  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiResultUrl, setAiResultUrl] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Initialize image when file is selected
  const handleFileSelect = async (file: File) => {
    try {
      const url = await readFileAsDataURL(file);
      const img = await loadImage(url);
      
      setImageState({
        file,
        originalPreviewUrl: url,
        processedPreviewUrl: url,
        originalWidth: img.width,
        originalHeight: img.height,
        processedWidth: img.width,
        processedHeight: img.height,
        fileSize: file.size,
        processedSize: file.size,
      });

      setOptions({
        width: img.width,
        height: img.height,
        maintainAspectRatio: true,
        quality: 90,
        format: file.type as any || 'image/jpeg',
        scale: 100
      });

      // Fetch AI suggestions in background
      analyzeImageSuggestions(url).then(suggestions => {
          setAiSuggestions(suggestions.split('|'));
      });

    } catch (error) {
      console.error('Error loading image:', error);
      alert('Failed to load image');
    }
  };

  // Debounced processing for preview (optional optimization, but let's keep it manual for explicit control on heavy images)
  const handleProcess = async () => {
    if (!imageState.originalPreviewUrl) return;

    setIsProcessing(true);
    try {
      // Small delay to allow UI to show loading state
      await new Promise(r => setTimeout(r, 50));
      
      const result = await processImage(
        imageState.originalPreviewUrl,
        options.width,
        options.height,
        options.format,
        options.quality
      );

      setImageState(prev => ({
        ...prev,
        processedPreviewUrl: result.url,
        processedWidth: options.width,
        processedHeight: options.height,
        processedSize: result.size
      }));
    } catch (error) {
      console.error(error);
      alert('Processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!imageState.originalPreviewUrl || !aiPrompt.trim()) return;
    
    setIsAiProcessing(true);
    try {
        const resultBase64 = await editImageWithGemini(
            imageState.originalPreviewUrl,
            aiPrompt
        );
        setAiResultUrl(resultBase64);
    } catch (error: any) {
        console.error(error);
        alert(error.message || 'AI Generation failed');
    } finally {
        setIsAiProcessing(false);
    }
  };

  const handleDownload = () => {
    const url = activeTab === Tab.AI_EDIT ? aiResultUrl : imageState.processedPreviewUrl;
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    const ext = activeTab === Tab.AI_EDIT ? 'png' : options.format.split('/')[1];
    link.download = `pixeltune-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setImageState({
      file: null,
      originalPreviewUrl: null,
      processedPreviewUrl: null,
      originalWidth: 0,
      originalHeight: 0,
      processedWidth: 0,
      processedHeight: 0,
      fileSize: 0,
      processedSize: null,
    });
    setAiResultUrl(null);
    setAiPrompt('');
    setAiSuggestions([]);
  };

  if (!imageState.file) {
    return <ImageUploader onFileSelect={handleFileSelect} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100">
      <Workspace
        originalUrl={imageState.originalPreviewUrl!}
        processedUrl={imageState.processedPreviewUrl}
        processedSizeInfo={{ w: imageState.processedWidth, h: imageState.processedHeight }}
        aiResultUrl={aiResultUrl}
        activeTab={activeTab}
        onDownload={handleDownload}
        onClear={handleClear}
        isProcessing={isProcessing}
        isAiProcessing={isAiProcessing}
      />
      
      <EditorSidebar
        options={options}
        setOptions={setOptions}
        originalSize={imageState.fileSize}
        processedSize={imageState.processedSize}
        onProcess={handleProcess}
        isProcessing={isProcessing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        onAiGenerate={handleAiGenerate}
        isAiProcessing={isAiProcessing}
        aiSuggestions={aiSuggestions}
        onApplySuggestion={(s) => setAiPrompt(s)}
      />
    </div>
  );
};

export default App;
