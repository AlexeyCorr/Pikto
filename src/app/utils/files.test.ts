import { describe, expect, it } from 'vitest';
import type { RasterOutputFormat, VideoOutputFormat } from '../types';
import { dedupeRasterFormats, dedupeVideoFormats, filterAcceptedFiles, formatBytes } from './files';

const svgFile = new File(['<svg></svg>'], 'icon.svg', { type: 'image/svg+xml' });
const pngFile = new File(['png'], 'cover.png', { type: 'image/png' });
const txtFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
const mp4File = new File(['mp4'], 'clip.mp4', { type: 'video/mp4' });
const webmFile = new File(['webm'], 'clip.webm', { type: 'video/webm' });
const aviFile = new File(['avi'], 'clip.avi', { type: 'video/x-msvideo' });
const movFile = new File(['mov'], 'clip.mov', { type: 'video/quicktime' });
const mkvFile = new File(['mkv'], 'clip.mkv', { type: 'video/x-matroska' });
const webpFile = new File(['webp'], 'photo.webp', { type: 'image/webp' });
const jpgFile  = new File(['jpg'],  'photo.jpg',  { type: 'image/jpeg' });

describe('filterAcceptedFiles', () => {
  it('accepts only svg files in vector mode', () => {
    const result = filterAcceptedFiles('vector', [svgFile, pngFile, txtFile]);

    expect(result.accepted.map((file) => file.name)).toEqual(['icon.svg']);
    expect(result.rejected.map((item) => item.file.name)).toEqual(['cover.png', 'notes.txt']);
  });

  it('accepts supported raster files in raster mode', () => {
    const result = filterAcceptedFiles('raster', [svgFile, pngFile, txtFile]);

    expect(result.accepted.map((file) => file.name)).toEqual(['cover.png']);
    expect(result.rejected.map((item) => item.file.name)).toEqual(['icon.svg', 'notes.txt']);
  });

  it('accepts mp4 and avi files in video mode', () => {
    const result = filterAcceptedFiles('video', [svgFile, mp4File, webmFile, aviFile, txtFile]);

    expect(result.accepted.map((file) => file.name)).toEqual(['clip.mp4', 'clip.avi']);
    expect(result.rejected.map((item) => item.file.name)).toEqual(['icon.svg', 'clip.webm', 'notes.txt']);
  });
});

describe('formatBytes', () => {
  it('formats bytes into readable units', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.00 MB');
  });
});

describe('dedupeRasterFormats', () => {
  it('removes explicit format when it duplicates the source via original', () => {
    const result = dedupeRasterFormats(webpFile, ['original', 'webp'] as RasterOutputFormat[]);
    expect(result).toEqual(['original']);
  });

  it('keeps explicit format when the source is a different format', () => {
    const result = dedupeRasterFormats(jpgFile, ['original', 'webp', 'avif'] as RasterOutputFormat[]);
    expect(result).toEqual(['original', 'webp', 'avif']);
  });

  it('removes jpg extra when source is jpg', () => {
    const result = dedupeRasterFormats(jpgFile, ['original', 'jpg', 'webp'] as RasterOutputFormat[]);
    expect(result).toEqual(['original', 'webp']);
  });

  it('returns unchanged list when no duplicate exists', () => {
    const result = dedupeRasterFormats(webpFile, ['original', 'avif'] as RasterOutputFormat[]);
    expect(result).toEqual(['original', 'avif']);
  });

  it('handles list without original', () => {
    const result = dedupeRasterFormats(webpFile, ['webp', 'avif'] as RasterOutputFormat[]);
    expect(result).toEqual(['webp', 'avif']);
  });

  it('handles empty formats array', () => {
    expect(dedupeRasterFormats(jpgFile, [])).toEqual([]);
  });

  it('treats jpeg extension the same as jpg', () => {
    const jpegFile = new File(['jpg'], 'photo.jpeg', { type: 'image/jpeg' });
    const result = dedupeRasterFormats(jpegFile, ['original', 'jpg'] as RasterOutputFormat[]);
    expect(result).toEqual(['original']);
  });
});

describe('dedupeVideoFormats', () => {
  it('removes explicit mp4 when source is mp4', () => {
    const result = dedupeVideoFormats(mp4File, ['original', 'mp4'] as VideoOutputFormat[]);
    expect(result).toEqual(['original']);
  });

  it('keeps avi output when source is mp4', () => {
    const result = dedupeVideoFormats(mp4File, ['original', 'avi'] as VideoOutputFormat[]);
    expect(result).toEqual(['original', 'avi']);
  });

  it('removes explicit avi when source is avi', () => {
    const result = dedupeVideoFormats(aviFile, ['original', 'avi'] as VideoOutputFormat[]);
    expect(result).toEqual(['original']);
  });

  it('keeps explicit mp4 when source is mov', () => {
    const result = dedupeVideoFormats(movFile, ['original', 'mp4'] as VideoOutputFormat[]);
    expect(result).toEqual(['original', 'mp4']);
  });

  it('keeps explicit mp4 when source is mkv', () => {
    const result = dedupeVideoFormats(mkvFile, ['original', 'mp4'] as VideoOutputFormat[]);
    expect(result).toEqual(['original', 'mp4']);
  });
});
