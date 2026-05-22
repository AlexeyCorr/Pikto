import type {
  JobOutput,
  RasterOutputFormat,
  RasterSettings,
  VectorSettings,
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

export type WorkerRequest =
  | { type: 'process-raster-batch'; jobs: WorkerRasterJob[] }
  | { type: 'process-vector-batch'; jobs: WorkerVectorJob[] };

export type WorkerResponse =
  | { type: 'progress'; completed: number; total: number }
  | { type: 'done'; results: JobOutput[] }
  | { type: 'error'; message: string };
