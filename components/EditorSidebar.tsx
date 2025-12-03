import React from 'react';
import { ImageFormat, ProcessingOptions, Tab } from '../types';
import { Icons } from './ui/Icons';
import { formatBytes } from '../utils/imageUtils';

interface EditorSidebarProps {
  options: ProcessingOptions;
  setOptions: React.Dispatch<React.SetStateAction<ProcessingOptions>>;
  originalSize: number;
  processedSize: number | null;
  onProcess: () => void;
  isProcessing: boolean;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  aiPrompt: string;
  setAiPrompt: (s: string) => void;
  onAiGenerate: () => void;
  isAiProcessing: boolean;
  aiSuggestions: string[];
  onApplySuggestion: (s: string) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  options,
  setOptions,
  originalSize,
  processedSize,
  onProcess,
  isProcessing,
  activeTab,
  setActiveTab,
  aiPrompt,
  setAiPrompt,
  onAiGenerate,
  isAiProcessing,
  aiSuggestions,
  onApplySuggestion
}) => {
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    setOptions(prev => ({
      ...prev,
      width: newWidth,
      height: prev.maintainAspectRatio ? Math.round(newWidth * (prev.height / prev.width)) : prev.height
    }));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    setOptions(prev => ({
      ...prev,
      height: newHeight,
      width: prev.maintainAspectRatio ? Math.round(newHeight * (prev.width / prev.height)) : prev.width
    }));
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseInt(e.target.value);
    setOptions(prev => ({
      ...prev,
      scale,
      width: Math.round(prev.width * (scale / prev.scale)),
      height: Math.round(prev.height * (scale / prev.scale))
    }));
  };

  return (
    <aside className="w-full md:w-80 bg-zinc-900 border-t md:border-t-0 md:border-r border-zinc-800 flex flex-col h-[50vh] md:h-full overflow-y-auto shrink-0">
      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab(Tab.ADJUST)}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === Tab.ADJUST
              ? 'text-blue-400 border-b-2 border-blue-400 bg-zinc-800/50'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
          }`}
        >
          <Icons.Settings size={16} />
          Adjust
        </button>
        <button
          onClick={() => setActiveTab(Tab.AI_EDIT)}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === Tab.AI_EDIT
              ? 'text-purple-400 border-b-2 border-purple-400 bg-zinc-800/50'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
          }`}
        >
          <Icons.Sparkles size={16} />
          AI Magic
        </button>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {activeTab === Tab.ADJUST ? (
          <>
            {/* Dimensions Section */}
            <div className="space-y-4">
              <h3 className="text-zinc-100 font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <Icons.Maximize size={14} /> Dimensions
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Width (px)</label>
                    <input
                      type="number"
                      value={options.width}
                      onChange={handleWidthChange}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400">Height (px)</label>
                    <input
                      type="number"
                      value={options.height}
                      onChange={handleHeightChange}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={options.maintainAspectRatio}
                      onChange={(e) => setOptions(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))}
                      className="rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-0 focus:ring-offset-0"
                    />
                    Lock Aspect Ratio
                  </label>
                </div>

                <div className="space-y-2 pt-2">
                   <div className="flex justify-between text-xs text-zinc-400">
                     <span>Scale</span>
                     <span>{options.scale}%</span>
                   </div>
                   <input
                    type="range"
                    min="1"
                    max="200"
                    value={options.scale}
                    onChange={handleScaleChange}
                    className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                   />
                </div>
              </div>
            </div>

            {/* Export Settings */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-zinc-100 font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <Icons.Download size={14} /> Export Settings
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Format</label>
                  <select
                    value={options.format}
                    onChange={(e) => setOptions(prev => ({ ...prev, format: e.target.value as ImageFormat }))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="image/jpeg">JPEG (Good for photos)</option>
                    <option value="image/png">PNG (Lossless, Transparent)</option>
                    <option value="image/webp">WebP (Best Compression)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Quality</span>
                    <span>{options.quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={options.quality}
                    onChange={(e) => setOptions(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                    className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    disabled={options.format === 'image/png'}
                  />
                  {options.format === 'image/png' && (
                    <p className="text-[10px] text-zinc-500">Quality adjustment not available for PNG</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="bg-zinc-950/50 rounded-lg p-4 space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500">Original:</span>
                   <span className="text-zinc-300">{formatBytes(originalSize)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-zinc-500">Estimated:</span>
                   <span className={`font-mono ${processedSize && processedSize < originalSize ? 'text-green-400' : 'text-zinc-300'}`}>
                     {processedSize ? formatBytes(processedSize) : 'Processing...'}
                   </span>
                 </div>
                 {processedSize && processedSize < originalSize && (
                   <div className="text-xs text-green-500 text-right pt-1">
                     Save {Math.round((1 - processedSize / originalSize) * 100)}%
                   </div>
                 )}
              </div>
            </div>

            <button
              onClick={onProcess}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
            >
              {isProcessing ? <Icons.Refresh className="animate-spin" size={18} /> : <Icons.Check size={18} />}
              Apply Changes
            </button>
          </>
        ) : (
          /* AI Tab */
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-zinc-100 font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <Icons.Wand size={14} /> Creative Edit
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Describe how you want to change the image. Gemini AI will generate a new version based on your request.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-zinc-400">Prompt</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Make it look like a Van Gogh painting, add a neon glow..."
                className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 resize-none placeholder-zinc-600"
              />
            </div>

            {aiSuggestions.length > 0 && (
              <div className="space-y-2">
                 <span className="text-xs text-zinc-500">Suggestions:</span>
                 <div className="flex flex-wrap gap-2">
                   {aiSuggestions.map((s, i) => (
                     <button
                       key={i}
                       onClick={() => onApplySuggestion(s)}
                       className="text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-2 py-1 rounded-full transition-colors truncate max-w-full"
                     >
                       {s}
                     </button>
                   ))}
                 </div>
              </div>
            )}

            <button
              onClick={onAiGenerate}
              disabled={isAiProcessing || !aiPrompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
            >
              {isAiProcessing ? <Icons.Refresh className="animate-spin" size={18} /> : <Icons.Sparkles size={18} />}
              Generate with Gemini
            </button>
            
            <div className="text-[10px] text-zinc-500 text-center">
              Powered by Google Gemini 2.5 Flash
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default EditorSidebar;
