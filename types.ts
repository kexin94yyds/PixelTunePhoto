export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export interface ImageState {
  file: File | null;
  originalPreviewUrl: string | null;
  processedPreviewUrl: string | null;
  originalWidth: number;
  originalHeight: number;
  processedWidth: number;
  processedHeight: number;
  fileSize: number; // bytes
  processedSize: number | null; // bytes
}

export interface ProcessingOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  quality: number; // 0-100
  format: ImageFormat;
  scale: number; // percentage 1-100+
}

export enum Tab {
  ADJUST = 'adjust',
  AI_EDIT = 'ai_edit'
}

export interface AiEditOptions {
  prompt: string;
  isProcessing: boolean;
  resultImage: string | null;
}
