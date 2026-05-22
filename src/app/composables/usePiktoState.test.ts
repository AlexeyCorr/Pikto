import { describe, expect, it } from 'vitest';
import { usePiktoState } from './usePiktoState';

describe('usePiktoState', () => {
  it('marks results as outdated when raster settings change after completion', () => {
    const state = usePiktoState();

    state.results.value = [
      {
        id: '1',
        sourceFileName: 'cover.png',
        sourceFormat: 'png',
        targetFormat: 'webp',
        originalBytes: 1000,
        outputBytes: 500,
        savedPercent: 50,
        status: 'success',
      },
    ];
    state.status.value = 'done';

    state.setRasterQuality(65);

    expect(state.status.value).toBe('ready');
    expect(state.hasOutdatedResults.value).toBe(true);
  });
});
