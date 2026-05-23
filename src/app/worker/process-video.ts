import { FFmpeg } from '@ffmpeg/ffmpeg';
import ffmpegWorkerUrl from '@ffmpeg/ffmpeg/worker?url';
import ffmpegCoreUrl from '@ffmpeg/core?url';
import ffmpegCoreWasmUrl from '@ffmpeg/core/wasm?url';
import { fetchFile } from '@ffmpeg/util';
import { VIDEO_FORMAT_MIME_TYPES } from '../constants';
import { getFileExtension } from '../utils/files';
import type { VideoCompressionPreset, VideoFormat, VideoOutputFormat } from '../types';

let ffmpegPromise: Promise<FFmpeg> | null = null;
const WEBM_VIDEO_FILTER = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';

const MP4_CRF: Record<VideoCompressionPreset, string> = { high: '21', balanced: '28', small: '34' };
const WEBM_CRF: Record<VideoCompressionPreset, string> = { high: '24', balanced: '36', small: '50' };
const WEBM_FALLBACK_BITRATE: Record<VideoCompressionPreset, string> = { high: '2000k', balanced: '800k', small: '200k' };

const STRIP_METADATA_ARGS = ['-map_metadata', '-1', '-map_chapters', '-1', '-dn', '-sn'];
const VIDEO_CODEC_ARGS = ['-vf', WEBM_VIDEO_FILTER, '-pix_fmt', 'yuv420p'];
const AUDIO_ARGS = ['-c:a', 'libvorbis', '-b:a', '128k'];

function resolveSourceFormat(file: File): VideoFormat {
  if (file.type === 'video/webm') {
    return 'webm';
  }

  if (file.type === 'video/mp4') {
    return 'mp4';
  }

  return getFileExtension(file.name) === 'webm' ? 'webm' : 'mp4';
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
): string[] {
  if (targetFormat === 'mp4') {
    return [
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', MP4_CRF[preset],
      '-c:a', 'copy',
      '-movflags', '+faststart',
      outputName,
    ];
  }

  return [
    ...STRIP_METADATA_ARGS,
    '-c:v', 'libvpx-vp9',
    ...VIDEO_CODEC_ARGS,
    '-crf', WEBM_CRF[preset],
    '-b:v', '0',
    '-lag-in-frames', '0',
    '-auto-alt-ref', '0',
    '-avoid_negative_ts', 'make_zero',
    '-deadline', 'good',
    '-cpu-used', '4',
    ...AUDIO_ARGS,
    outputName,
  ];
}

function getFallbackVideoCommandArgs(
  outputName: string,
  targetFormat: VideoFormat,
  preset: VideoCompressionPreset,
): string[] | null {
  if (targetFormat !== 'webm') {
    return null;
  }

  return [
    ...STRIP_METADATA_ARGS,
    '-c:v', 'libvpx',
    ...VIDEO_CODEC_ARGS,
    '-b:v', WEBM_FALLBACK_BITRATE[preset],
    '-avoid_negative_ts', 'make_zero',
    '-deadline', 'realtime',
    '-cpu-used', '5',
    '-threads', '1',
    ...AUDIO_ARGS,
    outputName,
  ];
}

function isWasmBoundsError(error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes('RuntimeError: index out of bounds');
}

function toExecError(error: unknown, recentLogs: string[]) {
  const msg = error instanceof Error ? error.message : String(error);
  const logSuffix = recentLogs.length > 0
    ? ` | ffmpeg log: ${recentLogs.slice(-4).join(' | ')}`
    : '';

  return new Error(`ffmpeg exec failed: ${msg}${logSuffix}`);
}

export async function preloadFfmpeg() {
  await getFfmpeg();
}

async function getFfmpeg() {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        classWorkerURL: ffmpegWorkerUrl,
        coreURL: ffmpegCoreUrl,
        wasmURL: ffmpegCoreWasmUrl,
      });
      return ffmpeg;
    })();
  }

  return ffmpegPromise;
}

export async function encodeVideoFile(
  file: File,
  targetFormat: VideoOutputFormat,
  preset: VideoCompressionPreset,
  onProgress?: (progress: number) => void,
) {
  const ffmpeg = await getFfmpeg();
  const sourceFormat = resolveSourceFormat(file);
  const outputFormat = getVideoOutputFormat(file, targetFormat);
  const inputName = `input.${sourceFormat}`;
  const outputName = `output.${outputFormat}`;
  const recentLogs: string[] = [];
  const progressHandler = onProgress
    ? (() => {
        let maxProgress = 0;
        return ({ progress }: { progress: number }) => {
          const clamped = Math.min(0.95, Math.max(0, progress));
          if (clamped > maxProgress) {
            maxProgress = clamped;
            onProgress(maxProgress);
          }
        };
      })()
    : null;
  const logHandler = ({ message }: { message: string }) => {
    recentLogs.push(message);

    if (recentLogs.length > 8) {
      recentLogs.shift();
    }
  };

  if (progressHandler) {
    ffmpeg.on('progress', progressHandler);
  }

  ffmpeg.on('log', logHandler);

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  try {
    let exitCode: number;
    const webmFallbackArgs = getFallbackVideoCommandArgs(outputName, outputFormat, preset);

    try {
      exitCode = await ffmpeg.exec([
        ...getVideoInputArgs(outputFormat),
        '-i',
        inputName,
        ...getVideoCommandArgs(outputName, outputFormat, preset),
      ]);
    } catch (execError) {
      if (webmFallbackArgs && isWasmBoundsError(execError)) {
        try {
          exitCode = await ffmpeg.exec([
            ...getVideoInputArgs(outputFormat),
            '-i',
            inputName,
            ...webmFallbackArgs,
          ]);
        } catch (fallbackError) {
          throw toExecError(fallbackError, recentLogs);
        }
      } else {
        throw toExecError(execError, recentLogs);
      }
    }

    if (exitCode !== 0) {
      throw new Error(`ffmpeg exited with code ${exitCode}`);
    }

    const data = await ffmpeg.readFile(outputName);
    return new Blob([data as Uint8Array<ArrayBuffer>], { type: VIDEO_FORMAT_MIME_TYPES[outputFormat] });
  } finally {
    if (progressHandler) {
      ffmpeg.off('progress', progressHandler);
    }

    ffmpeg.off('log', logHandler);
    await ffmpeg.deleteFile(inputName).catch(() => undefined);
    await ffmpeg.deleteFile(outputName).catch(() => undefined);
  }
}
