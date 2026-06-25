export {
  ACCEPT_ATTRIBUTE_BY_MODE,
  ACCEPTED_FILE_TYPES,
  FILE_EXTENSION_TO_FORMAT,
  FORMATS,
  RASTER_FORMATS,
  RASTER_FORMAT_MIME_TYPES,
  RASTER_MIME_TYPE_TO_FORMAT,
  VECTOR_MIME_TYPES,
  VIDEO_ACCEPTED_INPUT_FORMATS,
  VIDEO_EXTENSION_TO_FORMAT,
  VIDEO_FORMAT_MIME_TYPES,
  VIDEO_MIME_TYPE_TO_FORMAT,
  VIDEO_OUTPUT_FORMATS,
} from './formats';

import type {
  Mode,
  RasterFormat,
  RasterSettings,
  VectorSettings,
  VideoCompressionPreset,
  VideoFormat,
  VideoSettings,
} from './types';
import { FORMATS, RASTER_FORMATS, VIDEO_OUTPUT_FORMATS } from './formats';

export const MAX_FILE_SIZE: Record<Mode, number> = {
  raster: 50 * 1024 * 1024,
  vector: 10 * 1024 * 1024,
  video: 500 * 1024 * 1024,
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
  avifEffort: 4,
  pngEffort: 3,
  resize: { width: null, height: null, linked: true },
};

export const RASTER_EXTRA_FORMATS: RasterFormat[] = [...RASTER_FORMATS];

export const VIDEO_EXTRA_FORMATS: VideoFormat[] = [...VIDEO_OUTPUT_FORMATS];

export const VIDEO_COMPRESSION_PRESETS: VideoCompressionPreset[] = ['high', 'balanced', 'small'];

export const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  includeOriginal: true,
  selectedFormats: [],
  compressionPreset: 'balanced',
  removeAudio: false,
};
