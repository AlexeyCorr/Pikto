import { t } from '../i18n';
import { ACCEPTED_FILE_TYPES, FILE_EXTENSION_TO_FORMAT, MAX_FILE_SIZE } from '../constants';
import type { Mode, RasterFormat, RasterOutputFormat, RejectedFile, VideoFormat, VideoOutputFormat } from '../types';

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

export function dedupeRasterFormats(file: File, formats: RasterOutputFormat[]): RasterOutputFormat[] {
  const ext = getFileExtension(file.name);
  const sourceFormat: RasterFormat = FILE_EXTENSION_TO_FORMAT[ext] ?? 'png';
  const seen = new Set<string>();

  return formats.filter((fmt) => {
    const effective = fmt === 'original' ? sourceFormat : fmt;
    if (seen.has(effective)) return false;
    seen.add(effective);
    return true;
  });
}

export function dedupeVideoFormats(file: File, formats: VideoOutputFormat[]): VideoOutputFormat[] {
  let sourceFormat: VideoFormat;

  if (file.type === 'video/mp4')               sourceFormat = 'mp4';
  else if (file.type === 'video/webm')          sourceFormat = 'webm';
  else if (file.type === 'video/x-msvideo')     sourceFormat = 'avi';
  else {
    const ext = getFileExtension(file.name);
    sourceFormat = ext === 'webm' ? 'webm' : ext === 'avi' ? 'avi' : 'mp4';
  }

  const seen = new Set<string>();

  return formats.filter((fmt) => {
    const effective = fmt === 'original' ? sourceFormat : fmt;
    if (seen.has(effective)) return false;
    seen.add(effective);
    return true;
  });
}
