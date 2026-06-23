import { FORMATS, RASTER_FORMATS, VIDEO_ACCEPTED_INPUT_FORMATS, VIDEO_OUTPUT_FORMATS } from './formats';

export type Mode = 'raster' | 'vector' | 'video';

export type RasterFormat = typeof RASTER_FORMATS[number];

export type RasterOutputFormat = RasterFormat | 'original';

export type VideoFormat = typeof VIDEO_OUTPUT_FORMATS[number];

export type VideoInputFormat = typeof VIDEO_ACCEPTED_INPUT_FORMATS[number] | typeof FORMATS.WEBM;

export type VideoOutputFormat = VideoFormat | 'original';

export type VideoCompressionPreset = 'high' | 'balanced' | 'small';

export type OutputFormat = RasterOutputFormat | VideoInputFormat | VideoOutputFormat | typeof FORMATS.SVG;

export interface VideoSettings {
  includeOriginal: boolean;
  selectedFormats: VideoFormat[];
  compressionPreset: VideoCompressionPreset;
  removeAudio: boolean;
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
  avifEffort: number;
  pngEffort: number;
  resize: RasterResizeSettings;
}

export interface JobOutput {
  id: string;
  sourceIndex: number;
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
