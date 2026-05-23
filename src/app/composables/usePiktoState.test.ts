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

  describe('resize', () => {
    it('setResizeWidth updates width and marks results outdated', () => {
      const state = usePiktoState();
      state.results.value = [
        {
          id: '1', sourceFileName: 'a.png', sourceFormat: 'png',
          targetFormat: 'png', originalBytes: 1000, outputBytes: 500,
          savedPercent: 50, status: 'success',
        },
      ];
      state.status.value = 'done';
      state.setResizeWidth(800);
      expect(state.rasterSettings.value.resize.width).toBe(800);
      expect(state.hasOutdatedResults.value).toBe(true);
    });

    it('setResizeWidth recalculates height when linked and sourceImageSize is set', () => {
      const state = usePiktoState();
      state.sourceImageSize.value = { width: 1920, height: 1080 };
      state.setResizeWidth(960);
      expect(state.rasterSettings.value.resize.height).toBe(540);
    });

    it('setResizeWidth does not recalculate height when locked is false', () => {
      const state = usePiktoState();
      state.sourceImageSize.value = { width: 1920, height: 1080 };
      state.rasterSettings.value.resize.linked = false;
      state.rasterSettings.value.resize.height = 200;
      state.setResizeWidth(960);
      expect(state.rasterSettings.value.resize.height).toBe(200);
    });

    it('setResizeHeight recalculates width when linked and sourceImageSize is set', () => {
      const state = usePiktoState();
      state.sourceImageSize.value = { width: 1920, height: 1080 };
      state.setResizeHeight(540);
      expect(state.rasterSettings.value.resize.width).toBe(960);
    });

    it('setResizeLocked sets locked flag', () => {
      const state = usePiktoState();
      state.setResizeLocked(false);
      expect(state.rasterSettings.value.resize.linked).toBe(false);
    });

    it('resizeActive is true when both width and height are positive', () => {
      const state = usePiktoState();
      state.rasterSettings.value.resize.width = 800;
      state.rasterSettings.value.resize.height = 600;
      expect(state.resizeActive.value).toBe(true);
    });

    it('resizeActive is false when width is null', () => {
      const state = usePiktoState();
      state.rasterSettings.value.resize.height = 600;
      expect(state.resizeActive.value).toBe(false);
    });

    it('resizeActive is false when width is 0', () => {
      const state = usePiktoState();
      state.rasterSettings.value.resize.width = 0;
      state.rasterSettings.value.resize.height = 600;
      expect(state.resizeActive.value).toBe(false);
    });
  });
});
