import { describe, expect, it } from 'vitest';
import { RASTER_FORMATS, VIDEO_ACCEPTED_INPUT_FORMATS } from '../constants';
import { en } from './en';
import { ru } from './ru';

const rasterFormatsList = RASTER_FORMATS.map((format) => format.toUpperCase()).join(', ');
const videoFormatsList = VIDEO_ACCEPTED_INPUT_FORMATS.map((format) => format.toUpperCase()).join(', ');

describe('translation format lists', () => {
  it('builds raster format strings from raster format constants', () => {
    expect(ru.uploadPanel.rasterFormats).toBe(rasterFormatsList);
    expect(en.uploadPanel.rasterFormats).toBe(rasterFormatsList);
    expect(ru.uploadPanel.rejectRasterReason).toContain(rasterFormatsList);
    expect(en.uploadPanel.rejectRasterReason).toContain(rasterFormatsList);
  });

  it('builds video format strings from video format constants', () => {
    expect(ru.uploadPanel.videoFormats).toBe(videoFormatsList);
    expect(en.uploadPanel.videoFormats).toBe(videoFormatsList);
    expect(ru.uploadPanel.rejectVideoReason).toContain(videoFormatsList);
    expect(en.uploadPanel.rejectVideoReason).toContain(videoFormatsList);
  });
});
