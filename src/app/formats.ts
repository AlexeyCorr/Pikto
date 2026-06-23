export const FORMATS = {
  SVG: 'svg',
  JPG: 'jpg',
  PNG: 'png',
  WEBP: 'webp',
  AVIF: 'avif',
  MP4: 'mp4',
  WEBM: 'webm',
  AVI: 'avi',
  MPG: 'mpg',
  MOV: 'mov',
  MKV: 'mkv',
  GIF: 'gif',
} as const;

const FORMAT_MIME_TYPES = {
  [FORMATS.SVG]: 'image/svg+xml',
  [FORMATS.JPG]: 'image/jpeg',
  [FORMATS.PNG]: 'image/png',
  [FORMATS.WEBP]: 'image/webp',
  [FORMATS.AVIF]: 'image/avif',
  [FORMATS.MP4]: 'video/mp4',
  [FORMATS.WEBM]: 'video/webm',
  [FORMATS.AVI]: 'video/x-msvideo',
  [FORMATS.MPG]: 'video/mpeg',
  [FORMATS.MOV]: 'video/quicktime',
  [FORMATS.MKV]: 'video/x-matroska',
  [FORMATS.GIF]: 'image/gif',
} as const;

const FORMAT_EXTENSIONS = {
  [FORMATS.SVG]: [FORMATS.SVG],
  [FORMATS.JPG]: [FORMATS.JPG, 'jpeg'],
  [FORMATS.PNG]: [FORMATS.PNG],
  [FORMATS.WEBP]: [FORMATS.WEBP],
  [FORMATS.AVIF]: [FORMATS.AVIF],
  [FORMATS.MP4]: [FORMATS.MP4],
  [FORMATS.WEBM]: [FORMATS.WEBM],
  [FORMATS.AVI]: [FORMATS.AVI],
  [FORMATS.MPG]: [FORMATS.MPG, 'mpeg'],
  [FORMATS.MOV]: [FORMATS.MOV],
  [FORMATS.MKV]: [FORMATS.MKV],
  [FORMATS.GIF]: [FORMATS.GIF],
} as const;

export const RASTER_FORMATS = [FORMATS.JPG, FORMATS.PNG, FORMATS.WEBP, FORMATS.AVIF] as const;
export const VIDEO_OUTPUT_FORMATS = [FORMATS.MP4, FORMATS.WEBM, FORMATS.AVI, FORMATS.MOV, FORMATS.MKV] as const;
export const VIDEO_ACCEPTED_INPUT_FORMATS = [FORMATS.MP4, FORMATS.AVI, FORMATS.MPG, FORMATS.MOV, FORMATS.MKV, FORMATS.GIF] as const;

function createMimeTypeMap<T extends string>(formats: readonly T[]): Record<T, string> {
  return Object.fromEntries(formats.map((format) => [format, FORMAT_MIME_TYPES[format as keyof typeof FORMAT_MIME_TYPES]])) as Record<T, string>;
}

function createExtensionToFormatMap<T extends string>(formats: readonly T[]): Record<string, T> {
  return Object.fromEntries(
    formats.flatMap((format) => FORMAT_EXTENSIONS[format as keyof typeof FORMAT_EXTENSIONS].map((extension) => [extension, format])),
  ) as Record<string, T>;
}

function createAcceptedExtensions<T extends string>(formats: readonly T[]) {
  return formats.flatMap((format) => FORMAT_EXTENSIONS[format as keyof typeof FORMAT_EXTENSIONS].map((extension) => `.${extension}`));
}

export const VECTOR_MIME_TYPES = [FORMAT_MIME_TYPES[FORMATS.SVG]] as const;
export const RASTER_FORMAT_MIME_TYPES = createMimeTypeMap(RASTER_FORMATS);
export const VIDEO_FORMAT_MIME_TYPES = createMimeTypeMap([...VIDEO_ACCEPTED_INPUT_FORMATS, FORMATS.WEBM]);

type ModeKey = 'raster' | 'vector' | 'video';

export const RASTER_MIME_TYPE_TO_FORMAT: Record<string, typeof RASTER_FORMATS[number]> = {
  [FORMAT_MIME_TYPES[FORMATS.JPG]]: FORMATS.JPG,
  [FORMAT_MIME_TYPES[FORMATS.PNG]]: FORMATS.PNG,
  [FORMAT_MIME_TYPES[FORMATS.WEBP]]: FORMATS.WEBP,
  [FORMAT_MIME_TYPES[FORMATS.AVIF]]: FORMATS.AVIF,
};

export const VIDEO_MIME_TYPE_TO_FORMAT: Record<string, typeof VIDEO_ACCEPTED_INPUT_FORMATS[number]> = {
  [FORMAT_MIME_TYPES[FORMATS.MP4]]: FORMATS.MP4,
  [FORMAT_MIME_TYPES[FORMATS.AVI]]: FORMATS.AVI,
  [FORMAT_MIME_TYPES[FORMATS.MPG]]: FORMATS.MPG,
  [FORMAT_MIME_TYPES[FORMATS.MOV]]: FORMATS.MOV,
  [FORMAT_MIME_TYPES[FORMATS.MKV]]: FORMATS.MKV,
  [FORMAT_MIME_TYPES[FORMATS.GIF]]: FORMATS.GIF,
};

export const FILE_EXTENSION_TO_FORMAT = createExtensionToFormatMap(RASTER_FORMATS);
export const VIDEO_EXTENSION_TO_FORMAT = createExtensionToFormatMap(VIDEO_ACCEPTED_INPUT_FORMATS);

const ACCEPTED_FILE_EXTENSIONS: Record<ModeKey, string[]> = {
  vector: createAcceptedExtensions([FORMATS.SVG]),
  raster: createAcceptedExtensions(RASTER_FORMATS),
  video: createAcceptedExtensions(VIDEO_ACCEPTED_INPUT_FORMATS),
};

export const ACCEPTED_FILE_TYPES: Record<ModeKey, string[]> = {
  vector: [...VECTOR_MIME_TYPES],
  raster: RASTER_FORMATS.map((format) => RASTER_FORMAT_MIME_TYPES[format]),
  video: VIDEO_ACCEPTED_INPUT_FORMATS.map((format) => VIDEO_FORMAT_MIME_TYPES[format]),
};

export const ACCEPT_ATTRIBUTE_BY_MODE: Record<ModeKey, string> = {
  vector: [...ACCEPTED_FILE_EXTENSIONS.vector, ...ACCEPTED_FILE_TYPES.vector].join(','),
  raster: ACCEPTED_FILE_EXTENSIONS.raster.join(','),
  video: [...ACCEPTED_FILE_EXTENSIONS.video, ...ACCEPTED_FILE_TYPES.video].join(','),
};
