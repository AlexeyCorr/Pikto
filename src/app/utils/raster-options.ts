import type { RasterSettings } from '../types';

export function mapRasterQuality(settings: RasterSettings) {
  const quality    = Math.min(100, Math.max(1, settings.quality));
  const webpMethod = Math.min(6,   Math.max(0, settings.webpMethod));
  const avifEffort = Math.min(10,  Math.max(0, settings.avifEffort));

  // WebP and AVIF quality scales differ from JPEG perceptually.
  // The same numeric quality produces higher visual fidelity (and larger files)
  // in WebP/AVIF than in JPEG. We scale down so that each format outputs a file
  // that is at least as small as the JPEG equivalent at the same UI quality level.
  //
  // WebP:  roughly quality × 0.80 matches JPEG perceptual equivalence.
  // AVIF:  roughly quality × 0.62 (jSquash default 50 ≈ JPEG 75).
  const webpQuality = Math.round(quality * 0.8);
  const avifQuality = Math.round(quality * 0.62);

  return {
    jpeg: {
      quality,
    },
    webp: {
      quality: webpQuality,
      method: webpMethod,
      // Improves chroma sharpness and quality-to-filesize ratio at no cost
      use_sharp_yuv: 1,
    },
    avif: {
      quality: avifQuality,
      speed: 10 - avifEffort,  // higher effort → lower speed → better quality
    },
    png: {
      level: quality > 80 ? 4 : quality > 55 ? 3 : 2,
    },
  };
}
