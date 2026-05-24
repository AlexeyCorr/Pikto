import { describe, expect, it } from 'vitest';
import { DEFAULT_RASTER_SETTINGS } from '../constants';
import { mapRasterQuality } from './raster-options';

describe('mapRasterQuality', () => {
  it('produces stable codec option buckets', () => {
    // DEFAULT: avifEffort: 4 → speed = 10 - 4 = 6
    const result = mapRasterQuality({ ...DEFAULT_RASTER_SETTINGS, quality: 80 });

    expect(result.jpeg.quality).toBe(80);
    expect(result.webp.quality).toBe(64);
    expect(result.webp.method).toBe(4);
    expect(result.avif.quality).toBe(50);
    expect(result.avif.speed).toBe(6); // 10 - avifEffort(4) = 6
    expect(result.png.level).toBe(3);
  });

  it('respects custom webpMethod and avifEffort', () => {
    const result = mapRasterQuality({
      ...DEFAULT_RASTER_SETTINGS,
      quality: 80,
      webpMethod: 2,
      avifEffort: 7,
    });

    expect(result.webp.method).toBe(2);
    expect(result.avif.speed).toBe(3); // 10 - 7
  });

  it('higher avifEffort produces lower encoder speed (better quality)', () => {
    const highEffort = mapRasterQuality({ ...DEFAULT_RASTER_SETTINGS, avifEffort: 9 });
    const lowEffort  = mapRasterQuality({ ...DEFAULT_RASTER_SETTINGS, avifEffort: 1 });

    expect(highEffort.avif.speed).toBeLessThan(lowEffort.avif.speed);
  });
});
