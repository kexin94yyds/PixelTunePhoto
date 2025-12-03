import React from 'react';
import { Icons } from './ui/Icons';
import { Tab } from '../types';

interface WorkspaceProps {
  originalUrl: string;
  processedUrl: string | null;
  processedSizeInfo: { w: number, h: number };
  aiResultUrl: string | null;
  activeTab: Tab;
  onDownload: () => void;
  onClear: () => void;
  isProcessing: boolean;
  isAiProcessing: boolean;
}

const Workspace: React.FC<WorkspaceProps> = ({
  originalUrl,
  processedUrl,
  processedSizeInfo,
  aiResultUrl,
  activeTab,
  onDownload,
  onClear,
  isProcessing,
  isAiProcessing
}) => {
  const displayUrl = activeTab === Tab.AI_EDIT 
    ? (aiResultUrl || originalUrl) 
    : (processedUrl || originalUrl);

  const showLoading = activeTab === Tab.ADJUST ? isProcessing : isAiProcessing;

  return (
    <main className="flex-1 bg-zinc-950 relative flex flex-col min-h-[50vh] md:h-full overflow-hidden order-first">
      {/* Toolbar */}
      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur z-10">
         <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              PixelTune
            </h1>
         </div>
         
         <div className="flex items-center gap-3">
           <button 
             onClick={onClear}
             className="text-zinc-400 hover:text-red-400 text-xs font-medium px-3 py-1.5 rounded hover:bg-red-950/30 transition-colors"
           >
             Close File
           </button>
           <button 
             onClick={onDownload}
             disabled={showLoading}
             className="bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Icons.Download size={14} />
             Download {activeTab === Tab.AI_EDIT ? 'Creation' : 'Image'}
           </button>
         </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative p-8 flex items-center justify-center overflow-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative shadow-2xl shadow-black/50 group max-w-full max-h-full">
            {showLoading && (
              <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3 rounded-lg">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin"></div>
                  {activeTab === Tab.AI_EDIT && <Icons.Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 animate-pulse" size={16} />}
                </div>
                <p className="text-zinc-200 font-medium text-sm animate-pulse">
                  {activeTab === Tab.AI_EDIT ? 'Gemini is thinking...' : 'Processing...'}
                </p>
              </div>
            )}
            
            <img 
              src={displayUrl} 
              alt="Workspace" 
              className="max-w-full max-h-[40vh] md:max-h-[calc(100vh-160px)] object-contain rounded-sm border border-zinc-800 bg-zinc-800/50" // transparent checkerboard fallback
            />

            {/* Overlay Info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur text-zinc-300 text-[10px] px-3 py-1.5 rounded-full border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
               {activeTab === Tab.ADJUST ? (
                 `${processedSizeInfo.w} x ${processedSizeInfo.h} px`
               ) : (
                 aiResultUrl ? 'AI Generated Variation' : 'Original Preview'
               )}
            </div>
        </div>
      </div>
    </main>
  );
};

export default Workspace;
