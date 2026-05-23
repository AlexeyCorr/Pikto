import type {
  Mode,
  RasterFormat,
  RasterSettings,
  VectorSettings,
  VideoCompressionPreset,
  VideoFormat,
  VideoSettings,
} from './types';

export const ACCEPTED_FILE_TYPES: Record<Mode, string[]> = {
  vector: ['image/svg+xml'],
  raster: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  video: ['video/mp4', 'video/webm'],
};

export const FILE_EXTENSION_TO_FORMAT: Record<string, RasterFormat> = {
  jpg: 'jpg',
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
  avif: 'avif',
};

export const RASTER_FORMAT_MIME_TYPES: Record<RasterFormat, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

export const DEFAULT_VECTOR_SETTINGS: VectorSettings = {
  prettifyMarkup: true,
  numberPrecision: 4,
  removeDimensions: true,
};

export const DEFAULT_RASTER_SETTINGS: RasterSettings = {
  quality: 75,
  includeOriginal: true,
  selectedFormats: [],
  webpMethod: 4,
  avifSpeed: 6,
  resize: { width: null, height: null, linked: true },
};

export const RASTER_EXTRA_FORMATS: RasterFormat[] = ['webp', 'avif'];

export const VIDEO_FORMAT_MIME_TYPES: Record<VideoFormat, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
};

export const VIDEO_EXTRA_FORMATS: VideoFormat[] = ['mp4'];

export const VIDEO_COMING_SOON_FORMATS: VideoFormat[] = ['webm'];

export const VIDEO_COMPRESSION_PRESETS: VideoCompressionPreset[] = ['high', 'balanced', 'small'];

export const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  includeOriginal: true,
  selectedFormats: [],
  compressionPreset: 'balanced',
};
