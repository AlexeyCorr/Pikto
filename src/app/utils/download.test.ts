import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { buildDownloadName, buildResultsArchive } from './download';

describe('buildResultsArchive', () => {
  it('creates a zip with all successful outputs', async () => {
    const archive = await buildResultsArchive([
      {
        id: '1',
        sourceFileName: 'cover.png',
        sourceFormat: 'png',
        targetFormat: 'webp',
        originalBytes: 1000,
        outputBytes: 500,
        savedPercent: 50,
        status: 'success',
        blob: new Blob(['hi'], { type: 'image/webp' }),
      },
    ]);

    const zip = await JSZip.loadAsync(archive);
    expect(Object.keys(zip.files)).toEqual(['cover.webp']);
  });
});

describe('buildDownloadName', () => {
  it('keeps the original extension when the target format is original', () => {
    expect(buildDownloadName('cover.jpeg', 'original')).toBe('cover.jpeg');
  });
});
