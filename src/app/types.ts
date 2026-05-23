export type Mode = 'raster' | 'vector' | 'video';

export type RasterFormat = 'jpg' | 'png' | 'webp' | 'avif';

export type RasterOutputFormat = RasterFormat | 'original';

export type VideoFormat = 'mp4' | 'webm';

export type VideoOutputFormat = VideoFormat | 'original';

export type VideoCompressionPreset = 'high' | 'balanced' | 'small';

export type OutputFormat = RasterOutputFormat | VideoOutputFormat | 'svg';

export interface VideoSettings {
  includeOriginal: boolean;
  selectedFormats: VideoFormat[];
  compressionPreset: VideoCompressionPreset;
}

export type JobStatus = 'success' | 'error';

export type ProcessingStatus =
  | 'idle'
  | 'ready'
  | 'processing'
  | 'done'
  | 'partial-success'
  | 'error';

export interface RejectedFile {
  file: File;
  reason: string;
}

export interface VectorSettings {
  prettifyMarkup: boolean;
  numberPrecision: number;
  removeDimensions: boolean;
}

export interface RasterResizeSettings {
  width: number | null;
  height: number | null;
  linked: boolean;
}

export interface RasterSettings {
  quality: number;
  includeOriginal: boolean;
  selectedFormats: RasterFormat[];
  webpMethod: number;
  avifSpeed: number;
  resize: RasterResizeSettings;
}

export interface JobOutput {
  id: string;
  sourceFileName: string;
  sourceFormat: string;
  targetFormat: OutputFormat;
  originalBytes: number;
  outputBytes: number;
  savedPercent: number;
  status: JobStatus;
  blob?: Blob;
  errorMessage?: string;
}

export interface BatchSummary {
  inputCount: number;
  outputCount: number;
  originalBytes: number;
  outputBytes: number;
  avgSavedPercent: number;
}
