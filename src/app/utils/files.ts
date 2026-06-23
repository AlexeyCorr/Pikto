import { t } from '../i18n';
import {
  ACCEPTED_FILE_TYPES,
  FILE_EXTENSION_TO_FORMAT,
  FORMATS,
  MAX_FILE_SIZE,
  VIDEO_EXTENSION_TO_FORMAT,
  VIDEO_MIME_TYPE_TO_FORMAT,
} from '../constants';
import type { Mode, RasterFormat, RasterOutputFormat, RejectedFile, VideoInputFormat, VideoOutputFormat } from '../types';

export function filterAcceptedFiles(mode: Mode, files: File[]) {
  const accepted: File[] = [];
  const rejected: RejectedFile[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE[mode]) {
      rejected.push({
        file,
        reason: t.value.uploadPanel.rejectTooLargeReason(formatBytes(MAX_FILE_SIZE[mode])),
      });
      continue;
    }

    if (ACCEPTED_FILE_TYPES[mode].includes(file.type)) {
      accepted.push(file);
      continue;
    }

    rejected.push({
      file,
      reason:
        mode === 'vector'
          ? t.value.uploadPanel.rejectVectorReason
          : mode === 'video'
            ? t.value.uploadPanel.rejectVideoReason
            : t.value.uploadPanel.rejectRasterReason,
    });
  }

  return { accepted, rejected };
}

export function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(2)} MB`;
}

export function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
}

export function resolveRasterSourceFormat(file: Pick<File, 'name'>): RasterFormat {
  return FILE_EXTENSION_TO_FORMAT[getFileExtension(file.name)] ?? FORMATS.PNG;
}

export function resolveVideoInputFormat(file: Pick<File, 'name' | 'type'>): VideoInputFormat {
  return VIDEO_MIME_TYPE_TO_FORMAT[file.type] ?? VIDEO_EXTENSION_TO_FORMAT[getFileExtension(file.name)] ?? FORMATS.MP4;
}

function dedupeOutputFormats<T extends string>(formats: T[], getEffectiveFormat: (format: T) => string) {
  const seen = new Set<string>();

  return formats.filter((format) => {
    const effectiveFormat = getEffectiveFormat(format);
    if (seen.has(effectiveFormat)) return false;
    seen.add(effectiveFormat);
    return true;
  });
}

export function dedupeRasterFormats(file: File, formats: RasterOutputFormat[]): RasterOutputFormat[] {
  const sourceFormat = resolveRasterSourceFormat(file);
  return dedupeOutputFormats(formats, (format) => (format === 'original' ? sourceFormat : format));
}

export function dedupeVideoFormats(file: File, formats: VideoOutputFormat[]): VideoOutputFormat[] {
  const sourceFormat = resolveVideoInputFormat(file);

  if (sourceFormat === FORMATS.GIF || sourceFormat === FORMATS.MPG) {
    return formats.filter((fmt) => fmt !== 'original');
  }

  return dedupeOutputFormats(formats, (format) => (format === 'original' ? sourceFormat : format));
}
