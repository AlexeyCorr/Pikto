import { render, screen } from '@testing-library/vue';
import { beforeEach, describe, expect, it } from 'vitest';
import SettingsPanel from './SettingsPanel.vue';
import { setLocale } from '@/app/i18n';

beforeEach(() => {
  setLocale('en');
});

describe('SettingsPanel', () => {
  it('renders video format and compression controls in video mode', () => {
    render(SettingsPanel, {
      props: {
        mode: 'video',
        raster: {
          quality: 75,
          includeOriginal: true,
          selectedFormats: [],
          webpMethod: 4,
          avifEffort: 4,
          pngEffort: 3,
          resize: { width: null, height: null, linked: true },
        },
        vector: {
          prettifyMarkup: true,
          numberPrecision: 4,
          removeDimensions: true,
        },
        video: {
          includeOriginal: true,
          selectedFormats: ['webm'],
          compressionPreset: 'balanced',
        },
        sourceImageSize: null,
        fileCount: 0,
      },
    });

    expect(screen.getByText(/output formats/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/original/i)).toBeInTheDocument();
    expect(screen.getByText(/webm/i)).toBeInTheDocument();
    expect(screen.getByText(/soon|скоро/i)).toBeInTheDocument();
    expect(screen.getByText(/compression preset/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/balanced/i)).toBeInTheDocument();
  });
});
