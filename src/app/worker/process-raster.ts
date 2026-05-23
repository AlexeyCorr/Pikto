import { encode as encodeAvif } from '@jsquash/avif';
import { encode as encodeJpeg } from '@jsquash/jpeg';
import { optimise as optimisePng } from '@jsquash/oxipng';
import { encode as encodeWebp } from '@jsquash/webp';
import resize from '@jsquash/resize';
import { FILE_EXTENSION_TO_FORMAT, RASTER_FORMAT_MIME_TYPES } from '../constants';
import { getFileExtension } from '../utils/files';
import { mapRasterQuality } from '../utils/raster-options';
import type { RasterFormat, RasterOutputFormat, RasterSettings } from '../types';

async function fileToImageData(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext('2d');

  if (!context) {
    bitmap.close();
    throw new Error('2D canvas context is unavailable.');
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  return context.getImageData(0, 0, canvas.width, canvas.height);
}

function resolveTargetFormat(file: File, targetFormat: RasterOutputFormat): RasterFormat {
  if (targetFormat !== 'original') {
    return targetFormat;
  }

  const extension = getFileExtension(file.name);
  return FILE_EXTENSION_TO_FORMAT[extension] ?? 'png';
}

export async function encodeRasterFile(
  file: File,
  targetFormat: RasterOutputFormat,
  settings: RasterSettings,
) {
  let imageData = await fileToImageData(file);

  const { width, height } = settings.resize;
  if (width !== null && width > 0 && height !== null && height > 0) {
    imageData = await resize(imageData, {
      width,
      height,
      method: 'lanczos3',
      fitMethod: 'stretch',
    });
  }

  const effectiveFormat = resolveTargetFormat(file, targetFormat);
  const options = mapRasterQuality(settings);

  switch (effectiveFormat) {
    case 'jpg':
      return new Blob([await encodeJpeg(imageData, options.jpeg)], {
        type: RASTER_FORMAT_MIME_TYPES.jpg,
      });
    case 'webp':
      return new Blob([await encodeWebp(imageData, options.webp)], {
        type: RASTER_FORMAT_MIME_TYPES.webp,
      });
    case 'avif':
      return new Blob([await encodeAvif(imageData, options.avif)], {
        type: RASTER_FORMAT_MIME_TYPES.avif,
      });
    case 'png': {
      const pngCanvas = new OffscreenCanvas(imageData.width, imageData.height);
      const pngCtx = pngCanvas.getContext('2d');
      if (!pngCtx) throw new Error('2D canvas context is unavailable.');
      pngCtx.putImageData(imageData, 0, 0);
      const pngBlob = await pngCanvas.convertToBlob({ type: 'image/png' });
      return new Blob([await optimisePng(await pngBlob.arrayBuffer(), options.png)], {
        type: RASTER_FORMAT_MIME_TYPES.png,
      });
    }
    default:
      throw new Error(`Unsupported target format: ${effectiveFormat}`);
  }
}

export function getRasterOutputFormat(file: File, targetFormat: RasterOutputFormat) {
  return resolveTargetFormat(file, targetFormat);
}
