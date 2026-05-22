export type Mode = 'raster' | 'vector';

export type RasterFormat = 'jpg' | 'png' | 'webp' | 'avif';

export type RasterOutputFormat = RasterFormat | 'original';

export type OutputFormat = RasterOutputFormat | 'svg';

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

export interface RasterSettings {
  quality: number;
  includeOriginal: boolean;
  selectedFormats: RasterFormat[];
  webpMethod: number;
  avifSpeed: number;
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
