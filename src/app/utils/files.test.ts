import { describe, expect, it } from 'vitest';
import { filterAcceptedFiles, formatBytes } from './files';

const svgFile = new File(['<svg></svg>'], 'icon.svg', { type: 'image/svg+xml' });
const pngFile = new File(['png'], 'cover.png', { type: 'image/png' });
const txtFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });

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
});

describe('formatBytes', () => {
  it('formats bytes into readable units', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.00 MB');
  });
});
