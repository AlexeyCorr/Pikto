import { describe, expect, it } from 'vitest';
import { DEFAULT_RASTER_SETTINGS } from '../constants';
import { mapRasterQuality } from './raster-options';

describe('mapRasterQuality', () => {
  it('produces stable codec option buckets', () => {
    const result = mapRasterQuality({ ...DEFAULT_RASTER_SETTINGS, quality: 80 });

    expect(result.jpeg.quality).toBe(80);
    expect(result.webp.quality).toBe(64); // scaled by 0.80 to match JPEG perceptual equivalence
    expect(result.webp.method).toBe(4);
    expect(result.avif.quality).toBe(50); // scaled by 0.62 to match JPEG perceptual equivalence
    expect(result.avif.speed).toBe(6);
    expect(result.png.level).toBe(3);
  });

  it('respects custom webpMethod and avifSpeed', () => {
    const result = mapRasterQuality({ ...DEFAULT_RASTER_SETTINGS, quality: 80, webpMethod: 4, avifSpeed: 6 });

    expect(result.webp.method).toBe(4);
    expect(result.avif.speed).toBe(6);
  });
});
