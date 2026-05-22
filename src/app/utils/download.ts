import JSZip from 'jszip';
import type { JobOutput } from '../types';

export function buildDownloadName(fileName: string, targetFormat: string) {
  if (targetFormat === 'original') {
    return fileName;
  }

  const stem = fileName.replace(/\.[^.]+$/, '');
  return `${stem}.${targetFormat}`;
}

export async function buildResultsArchive(results: JobOutput[]) {
  const zip = new JSZip();

  for (const result of results) {
    if (result.status !== 'success' || !result.blob) {
      continue;
    }

    zip.file(buildDownloadName(result.sourceFileName, result.targetFormat), result.blob);
  }

  return zip.generateAsync({ type: 'blob' });
}

export function triggerBlobDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}
