import { t } from '../i18n';
import { ACCEPTED_FILE_TYPES } from '../constants';
import type { Mode, RejectedFile } from '../types';

export function filterAcceptedFiles(mode: Mode, files: File[]) {
  const accepted: File[] = [];
  const rejected: RejectedFile[] = [];

  for (const file of files) {
    if (ACCEPTED_FILE_TYPES[mode].includes(file.type)) {
      accepted.push(file);
      continue;
    }

    rejected.push({
      file,
      reason:
        mode === 'vector'
          ? t.value.uploadPanel.rejectVectorReason
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
