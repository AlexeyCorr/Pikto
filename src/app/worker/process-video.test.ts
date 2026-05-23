import { beforeEach, describe, expect, it, vi } from 'vitest';

const ffmpegMock = {
  load: vi.fn(async () => undefined),
  writeFile: vi.fn(async () => undefined),
  exec: vi.fn(async () => 0),
  readFile: vi.fn(async () => new Uint8Array([1, 2, 3])),
  deleteFile: vi.fn(async () => undefined),
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('@ffmpeg/ffmpeg', () => ({
  FFmpeg: vi.fn(class {
    load = ffmpegMock.load;
    writeFile = ffmpegMock.writeFile;
    exec = ffmpegMock.exec;
    readFile = ffmpegMock.readFile;
    deleteFile = ffmpegMock.deleteFile;
    on = ffmpegMock.on;
    off = ffmpegMock.off;
  }),
}));

vi.mock('@ffmpeg/util', () => ({
  fetchFile: vi.fn(async () => new Uint8Array([7, 8, 9])),
}));

import { encodeVideoFile, getVideoCommandArgs, getVideoOutputFormat } from './process-video';

const mp4File = new File(['mp4'], 'clip.mp4', { type: 'video/mp4' });
const webmFile = new File(['webm'], 'clip.webm', { type: 'video/webm' });

beforeEach(() => {
  ffmpegMock.load.mockReset().mockImplementation(async () => undefined);
  ffmpegMock.writeFile.mockReset().mockImplementation(async () => undefined);
  ffmpegMock.exec.mockReset().mockImplementation(async () => 0);
  ffmpegMock.readFile.mockReset().mockImplementation(async () => new Uint8Array([1, 2, 3]));
  ffmpegMock.deleteFile.mockReset().mockImplementation(async () => undefined);
  ffmpegMock.on.mockReset();
  ffmpegMock.off.mockReset();
});

describe('getVideoOutputFormat', () => {
  it('keeps the source container when target format is original', () => {
    expect(getVideoOutputFormat(mp4File, 'original')).toBe('mp4');
    expect(getVideoOutputFormat(webmFile, 'original')).toBe('webm');
  });

  it('returns the explicit target format when requested', () => {
    expect(getVideoOutputFormat(mp4File, 'webm')).toBe('webm');
  });
});

describe('getVideoCommandArgs', () => {
  it('builds mp4 transcode args for the balanced preset', () => {
    expect(getVideoCommandArgs('output.mp4', 'mp4', 'balanced')).toEqual([
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '28',
      '-c:a', 'copy',
      '-movflags', '+faststart',
      'output.mp4',
    ]);
  });

  it('builds webm transcode args for the small preset', () => {
    expect(getVideoCommandArgs('output.webm', 'webm', 'small')).toEqual([
      '-map_metadata', '-1',
      '-map_chapters', '-1',
      '-dn',
      '-sn',
      '-c:v', 'libvpx-vp9',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt', 'yuv420p',
      '-crf', '50',
      '-b:v', '0',
      '-lag-in-frames', '0',
      '-auto-alt-ref', '0',
      '-avoid_negative_ts', 'make_zero',
      '-deadline', 'good',
      '-cpu-used', '4',
      '-c:a', 'libvorbis',
      '-b:a', '128k',
      'output.webm',
    ]);
  });
});

describe('encodeVideoFile', () => {
  it('loads ffmpeg from bundled local assets', async () => {
    await encodeVideoFile(mp4File, 'original', 'balanced');

    expect(ffmpegMock.load).toHaveBeenCalledWith({
      classWorkerURL: expect.stringMatching(/worker.*\.js/),
      coreURL: expect.stringMatching(/ffmpeg-core.*\.js/),
      wasmURL: expect.stringMatching(/ffmpeg-core.*\.wasm/),
    });
    expect(ffmpegMock.load.mock.calls[0]?.[0]).not.toEqual(
      expect.objectContaining({
        classWorkerURL: expect.stringContaining('https://'),
      }),
    );
  });

  it('forwards ffmpeg progress updates to the caller while encoding', async () => {
    ffmpegMock.exec.mockImplementationOnce(async () => {
      const progressHandler = ffmpegMock.on.mock.calls[0]?.[1] as
        | ((event: { progress: number }) => void)
        | undefined;

      progressHandler?.({ progress: 0.4 });
      return 0;
    });

    const onProgress = vi.fn();

    await encodeVideoFile(mp4File, 'original', 'balanced', onProgress);

    expect(onProgress).toHaveBeenCalledWith(0.4);
    expect(ffmpegMock.off).toHaveBeenCalledWith('progress', expect.any(Function));
  });

  it('retries webm encoding with a low-memory fallback when the default webm strategy fails with wasm bounds error', async () => {
    ffmpegMock.exec
      .mockRejectedValueOnce('RuntimeError: index out of bounds')
      .mockResolvedValueOnce(0);

    await encodeVideoFile(webmFile, 'original', 'balanced');

    expect(ffmpegMock.exec).toHaveBeenCalledTimes(2);
    expect(ffmpegMock.exec.mock.calls[0]?.[0]).toEqual([
      '-fflags', '+genpts',
      '-i',
      'input.webm',
      '-map_metadata', '-1',
      '-map_chapters', '-1',
      '-dn',
      '-sn',
      '-c:v', 'libvpx-vp9',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt', 'yuv420p',
      '-crf', '36',
      '-b:v', '0',
      '-lag-in-frames', '0',
      '-auto-alt-ref', '0',
      '-avoid_negative_ts', 'make_zero',
      '-deadline', 'good',
      '-cpu-used', '4',
      '-c:a', 'libvorbis',
      '-b:a', '128k',
      'output.webm',
    ]);
    expect(ffmpegMock.exec.mock.calls[1]?.[0]).toEqual([
      '-fflags', '+genpts',
      '-i',
      'input.webm',
      '-map_metadata', '-1',
      '-map_chapters', '-1',
      '-dn',
      '-sn',
      '-c:v', 'libvpx',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt', 'yuv420p',
      '-b:v', '800k',
      '-avoid_negative_ts', 'make_zero',
      '-deadline', 'realtime',
      '-cpu-used', '5',
      '-threads', '1',
      '-c:a', 'libvorbis',
      '-b:a', '128k',
      'output.webm',
    ]);
  });

  it('includes recent ffmpeg logs in the error when every webm strategy fails', async () => {
    ffmpegMock.exec.mockRejectedValue('RuntimeError: index out of bounds');
    ffmpegMock.on.mockImplementation((event: string, handler: (payload: { message: string }) => void) => {
      if (event === 'log') {
        handler({ message: 'libvpx init failed' });
      }
    });

    await expect(encodeVideoFile(webmFile, 'original', 'balanced')).rejects.toThrow(
      'ffmpeg exec failed: RuntimeError: index out of bounds | ffmpeg log: libvpx init failed',
    );
  });
});
