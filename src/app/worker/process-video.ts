import { FFmpeg } from '@ffmpeg/ffmpeg';
import ffmpegWorkerUrl from '@ffmpeg/ffmpeg/worker?url';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { VIDEO_FORMAT_MIME_TYPES } from '../constants';
import { getFileExtension } from '../utils/files';
import type { VideoCompressionPreset, VideoFormat, VideoOutputFormat } from '../types';

let ffmpegPromise: Promise<FFmpeg> | null = null;

const WEBM_VIDEO_FILTER = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';

const MP4_CRF: Record<VideoCompressionPreset, string> = { high: '21', balanced: '28', small: '34' };
const WEBM_CRF: Record<VideoCompressionPreset, string> = { high: '15', balanced: '25', small: '35' };

const STRIP_METADATA_ARGS = ['-map_metadata', '-1', '-map_chapters', '-1', '-dn', '-sn'];
const VIDEO_CODEC_ARGS = ['-vf', WEBM_VIDEO_FILTER, '-pix_fmt', 'yuv420p'];
const AUDIO_ARGS = ['-c:a', 'libvorbis', '-b:a', '128k'];

function resolveSourceFormat(file: File): VideoFormat {
  if (file.type === 'video/webm') return 'webm';
  if (file.type === 'video/mp4')  return 'mp4';
  if (file.type === 'video/x-msvideo') return 'avi';
  if (file.type === 'video/quicktime') return 'mov';
  if (file.type === 'video/x-matroska') return 'mkv';

  const ext = getFileExtension(file.name);
  if (ext === 'webm') return 'webm';
  if (ext === 'avi')  return 'avi';
  if (ext === 'mov')  return 'mov';
  if (ext === 'mkv')  return 'mkv';
  return 'mp4';
}

export function getVideoOutputFormat(file: File, targetFormat: VideoOutputFormat): VideoFormat {
  return targetFormat === 'original' ? resolveSourceFormat(file) : targetFormat;
}

function getVideoInputArgs(targetFormat: VideoFormat): string[] {
  return targetFormat === 'webm' ? ['-fflags', '+genpts'] : [];
}

export function getVideoCommandArgs(
  outputName: string,
  targetFormat: VideoFormat,
  preset: VideoCompressionPreset,
  removeAudio: boolean,
): string[] {
  const audioArgs = removeAudio ? ['-an'] : ['-c:a', 'copy'];

  if (targetFormat === 'mp4' || targetFormat === 'mov' || targetFormat === 'mkv') {
    return [
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', MP4_CRF[preset],
      ...audioArgs,
      '-movflags', '+faststart',
      outputName,
    ];
  }

  if (targetFormat === 'avi') {
    // AVI container does not support AAC — use mp3 audio instead
    const aviAudioArgs = removeAudio ? ['-an'] : ['-c:a', 'libmp3lame', '-b:a', '128k'];
    return [
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', MP4_CRF[preset],
      ...aviAudioArgs,
      outputName,
    ];
  }

  // VP8 via libvpx: lower memory footprint than VP9, stable in single-thread WASM.
  // To use CRF mode properly in libvpx (VP8), -b:v MUST be set to a high value.
  // Setting it to 0 in VP8 falls back to 256kbps which ruins quality.
  const webmAudioArgs = removeAudio ? ['-an'] : AUDIO_ARGS;
  return [
    ...STRIP_METADATA_ARGS,
    '-c:v', 'libvpx',
    ...VIDEO_CODEC_ARGS,
    '-crf', WEBM_CRF[preset],
    '-b:v', '100M',
    '-avoid_negative_ts', 'make_zero',
    '-deadline', 'good',
    '-cpu-used', '3',
    '-threads', '1',
    ...webmAudioArgs,
    outputName,
  ];
}

function toExecError(error: unknown, recentLogs: string[]): Error {
  const msg = error instanceof Error ? error.message : String(error);
  const logSuffix = recentLogs.length > 0
    ? ` | ffmpeg log: ${recentLogs.slice(-4).join(' | ')}`
    : '';
  console.error(`[pikto] ffmpeg exec failed: ${msg}${logSuffix}`);
  return new Error('Video encoding failed. The file may be corrupted or use an unsupported codec.');
}

export async function preloadFfmpeg() {
  await getFfmpeg();
}

// jsDelivr + esm build (Vite requires esm, not umd).
// toBlobURL downloads and re-serves files as blob:// to bypass cross-origin
// restrictions that some browsers apply to wasm loaded from foreign origins.
const FFMPEG_CDN = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm';

async function getFfmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        classWorkerURL: ffmpegWorkerUrl,
        coreURL: await toBlobURL(`${FFMPEG_CDN}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${FFMPEG_CDN}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return ffmpeg;
    })().catch((err) => {
      ffmpegPromise = null;
      throw err;
    });
  }
  return ffmpegPromise;
}

export async function encodeVideoFile(
  file: File,
  targetFormat: VideoOutputFormat,
  preset: VideoCompressionPreset,
  removeAudio: boolean,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  const ffmpeg = await getFfmpeg();
  const sourceFormat = resolveSourceFormat(file);
  const outputFormat = getVideoOutputFormat(file, targetFormat);
  const inputName = `input.${sourceFormat}`;
  const outputName = `output.${outputFormat}`;
  const recentLogs: string[] = [];

  let maxProgress = 0;
  const progressHandler = onProgress
    ? ({ progress }: { progress: number }) => {
        const clamped = Math.min(0.95, Math.max(0, progress));
        if (clamped > maxProgress) {
          maxProgress = clamped;
          onProgress(clamped);
        }
      }
    : null;

  const logHandler = ({ message }: { message: string }) => {
    recentLogs.push(message);
    if (recentLogs.length > 8) recentLogs.shift();
  };

  if (progressHandler) ffmpeg.on('progress', progressHandler);
  ffmpeg.on('log', logHandler);

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  try {
    const exitCode = await ffmpeg.exec([
      ...getVideoInputArgs(outputFormat),
      '-i', inputName,
      ...getVideoCommandArgs(outputName, outputFormat, preset, removeAudio),
    ]);

    if (exitCode !== 0) {
      throw new Error(`ffmpeg exited with code ${exitCode}`);
    }

    const data = await ffmpeg.readFile(outputName);
    return new Blob([data as Uint8Array<ArrayBuffer>], { type: VIDEO_FORMAT_MIME_TYPES[outputFormat] });
  } catch (error) {
    throw toExecError(error, recentLogs);
  } finally {
    if (progressHandler) ffmpeg.off('progress', progressHandler);
    ffmpeg.off('log', logHandler);
    await ffmpeg.deleteFile(inputName).catch(() => undefined);
    await ffmpeg.deleteFile(outputName).catch(() => undefined);
  }
}
