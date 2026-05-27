import { render } from '@testing-library/vue';
import { describe, expect, it } from 'vitest';
import UploadPanel from './UploadPanel.vue';

describe('UploadPanel', () => {
  it('uses video file accept types in video mode', () => {
    const { container } = render(UploadPanel, {
      props: {
        mode: 'video',
        files: [],
        rejectedFiles: [],
      },
    });

    const input = container.querySelector('input[type="file"]');
    expect(input?.getAttribute('accept')).toBe('.mp4,.avi,.mov,.mkv,video/mp4,video/x-msvideo,video/quicktime,video/x-matroska');
  });
});
