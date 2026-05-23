import type {
  JobOutput,
  RasterOutputFormat,
  RasterSettings,
  VectorSettings,
  VideoOutputFormat,
  VideoSettings,
} from '../types';

export interface WorkerRasterJob {
  id: string;
  file: File;
  targetFormats: RasterOutputFormat[];
  settings: RasterSettings;
}

export interface WorkerVectorJob {
  id: string;
  file: File;
  settings: VectorSettings;
}

export interface WorkerVideoJob {
  id: string;
  file: File;
  targetFormats: VideoOutputFormat[];
  settings: VideoSettings;
}

export type WorkerRequest =
  | { type: 'process-raster-batch'; jobs: WorkerRasterJob[] }
  | { type: 'process-vector-batch'; jobs: WorkerVectorJob[] }
  | { type: 'process-video-batch'; jobs: WorkerVideoJob[] }
  | { type: 'warmup-video' };

export type WorkerResponse =
  | { type: 'progress'; completed: number; total: number }
  | { type: 'done'; results: JobOutput[] }
  | { type: 'error'; message: string };
