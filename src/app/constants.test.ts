import { describe, expect, it } from 'vitest';
import {
  ACCEPT_ATTRIBUTE_BY_MODE,
  ACCEPTED_FILE_TYPES,
  FORMATS,
  RASTER_EXTRA_FORMATS,
  RASTER_FORMAT_MIME_TYPES,
  VIDEO_EXTRA_FORMATS,
  VIDEO_FORMAT_MIME_TYPES,
} from './constants';

describe('format constants', () => {
  it('exports a single source of truth for format ids', () => {
    expect(FORMATS.JPG).toBe('jpg');
    expect(FORMATS.PNG).toBe('png');
    expect(FORMATS.WEBP).toBe('webp');
    expect(FORMATS.AVIF).toBe('avif');
    expect(FORMATS.MP4).toBe('mp4');
    expect(FORMATS.WEBM).toBe('webm');
    expect(FORMATS.AVI).toBe('avi');
    expect(FORMATS.MPG).toBe('mpg');
    expect(FORMATS.MOV).toBe('mov');
    expect(FORMATS.MKV).toBe('mkv');
    expect(FORMATS.GIF).toBe('gif');
  });

  it('derives raster and video format collections from shared constants', () => {
    expect(RASTER_EXTRA_FORMATS).toEqual([FORMATS.JPG, FORMATS.PNG, FORMATS.WEBP, FORMATS.AVIF]);
    expect(VIDEO_EXTRA_FORMATS).toEqual([FORMATS.MP4, FORMATS.WEBM, FORMATS.AVI, FORMATS.MOV, FORMATS.MKV]);
  });

  it('keeps mime type maps aligned with format ids', () => {
    expect(RASTER_FORMAT_MIME_TYPES[FORMATS.JPG]).toBe('image/jpeg');
    expect(RASTER_FORMAT_MIME_TYPES[FORMATS.WEBP]).toBe('image/webp');
    expect(VIDEO_FORMAT_MIME_TYPES[FORMATS.MP4]).toBe('video/mp4');
    expect(VIDEO_FORMAT_MIME_TYPES[FORMATS.MPG]).toBe('video/mpeg');
    expect(VIDEO_FORMAT_MIME_TYPES[FORMATS.GIF]).toBe('image/gif');
  });

  it('builds accepted file types and accept attributes from the same registry', () => {
    expect(ACCEPTED_FILE_TYPES.video).toEqual([
      'video/mp4',
      'video/webm',
      'video/x-msvideo',
      'video/mpeg',
      'video/quicktime',
      'video/x-matroska',
      'image/gif',
    ]);
    expect(ACCEPT_ATTRIBUTE_BY_MODE.video).toBe(
      '.mp4,.webm,.avi,.mpg,.mpeg,.mov,.mkv,.gif,video/mp4,video/webm,video/x-msvideo,video/mpeg,video/quicktime,video/x-matroska,image/gif',
    );
  });
});
