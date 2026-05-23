import type { Mode, RasterFormat, RasterSettings, VectorSettings } from './types';

export const ACCEPTED_FILE_TYPES: Record<Mode, string[]> = {
  vector: ['image/svg+xml'],
  raster: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
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
