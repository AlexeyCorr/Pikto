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
  toBlobURL: vi.fn(async (url: string) => `blob:${url}`),
}));

import { encodeVideoFile, getVideoCommandArgs, getVideoOutputFormat } from './process-video';

const mp4File = new File(['mp4'], 'clip.mp4', { type: 'video/mp4' });
const aviFile = new File(['avi'], 'clip.avi', { type: 'video/x-msvideo' });
const mpgFile = new File(['mpg'], 'clip.mpg', { type: 'video/mpeg' });
const movFile = new File(['mov'], 'clip.mov', { type: 'video/quicktime' });
const mkvFile = new File(['mkv'], 'clip.mkv', { type: 'video/x-matroska' });
const gifFile = new File(['gif'], 'clip.gif', { type: 'image/gif' });

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
  });

  it('returns the explicit target format when requested', () => {
    expect(getVideoOutputFormat(mp4File, 'webm')).toBe('webm');
  });

  it('detects avi source when target is original', () => {
    expect(getVideoOutputFormat(aviFile, 'original')).toBe('avi');
  });

  it('detects mov source when target is original', () => {
    expect(getVideoOutputFormat(movFile, 'original')).toBe('mov');
  });

  it('detects mkv source when target is original', () => {
    expect(getVideoOutputFormat(mkvFile, 'original')).toBe('mkv');
  });

  it('falls back to avi via extension when mime is generic', () => {
    const aviByExtension = new File(['avi'], 'clip.avi', { type: 'application/octet-stream' });
    expect(getVideoOutputFormat(aviByExtension, 'original')).toBe('avi');
  });
});

describe('getVideoCommandArgs', () => {
  it('builds mp4 transcode args for the balanced preset', () => {
    expect(getVideoCommandArgs('output.mp4', 'mp4', 'balanced')).toEqual([
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt', 'yuv420p',
      '-crf', '28',
      '-c:a', 'copy',
      '-movflags', '+faststart',
      'output.mp4',
    ]);
  });

  it('builds webm transcode args for the small preset using VP8', () => {
    expect(getVideoCommandArgs('output.webm', 'webm', 'small')).toEqual([
      '-map_metadata', '-1',
      '-map_chapters', '-1',
      '-dn',
      '-sn',
      '-c:v', 'libvpx',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt', 'yuv420p',
      '-crf', '35',
      '-b:v', '100M',
      '-avoid_negative_ts', 'make_zero',
      '-deadline', 'good',
      '-cpu-used', '3',
      '-threads', '1',
      '-c:a', 'libvorbis',
      '-b:a', '128k',
      'output.webm',
    ]);
  });

  it('builds avi transcode args for the balanced preset', () => {
    expect(getVideoCommandArgs('output.avi', 'avi', 'balanced')).toEqual([
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      '-pix_fmt', 'yuv420p',
      '-crf', '28',
      '-c:a', 'libmp3lame',
      '-b:a', '128k',
      'output.avi',
    ]);
  });
});

describe('encodeVideoFile', () => {
  it('loads ffmpeg-core from CDN via blob URLs, worker from local bundle', async () => {
    await encodeVideoFile(mp4File, 'original', 'balanced');

    expect(ffmpegMock.load).toHaveBeenCalledWith({
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

    await encodeVideoFile(mp4File, 'original', 'balanced', false, onProgress);

    expect(onProgress).toHaveBeenCalledWith(0.4);
    expect(ffmpegMock.off).toHaveBeenCalledWith('progress', expect.any(Function));
  });

  it('keeps progress near-complete instead of snapping down to 95%', async () => {
    ffmpegMock.exec.mockImplementationOnce(async () => {
      const progressHandler = ffmpegMock.on.mock.calls[0]?.[1] as
        | ((event: { progress: number }) => void)
        | undefined;

      progressHandler?.({ progress: 1 });
      return 0;
    });

    const onProgress = vi.fn();

    await encodeVideoFile(mp4File, 'original', 'balanced', false, onProgress);

    expect(onProgress).toHaveBeenCalledWith(0.99);
  });

  it('uses the gif extension for ffmpeg input files', async () => {
    await encodeVideoFile(gifFile, 'mp4', 'balanced');

    expect(ffmpegMock.writeFile).toHaveBeenCalledWith('input.gif', expect.any(Uint8Array));
    expect(ffmpegMock.exec).toHaveBeenCalledWith(expect.arrayContaining(['-i', 'input.gif', 'output.mp4']));
  });

  it('uses the mpg extension for ffmpeg input files', async () => {
    await encodeVideoFile(mpgFile, 'avi', 'balanced');

    expect(ffmpegMock.writeFile).toHaveBeenCalledWith('input.mpg', expect.any(Uint8Array));
    expect(ffmpegMock.exec).toHaveBeenCalledWith(expect.arrayContaining(['-i', 'input.mpg', 'output.avi']));
  });

  it('returns a user-friendly error message when encoding fails', async () => {
    ffmpegMock.exec.mockRejectedValue(new Error('something went wrong'));
    ffmpegMock.on.mockImplementation((event: string, handler: (payload: { message: string }) => void) => {
      if (event === 'log') {
        handler({ message: 'encoder init failed' });
      }
    });

    await expect(encodeVideoFile(mp4File, 'original', 'balanced')).rejects.toThrow(
      'Video encoding failed. The file may be corrupted or use an unsupported codec.',
    );
  });
});
