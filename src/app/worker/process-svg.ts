import { optimize } from 'svgo/dist/svgo.browser.js';
import type { VectorSettings } from '../types';

export async function optimizeSvgText(source: string, settings: VectorSettings) {
  const result = optimize(source, {
    js2svg: {
      pretty: settings.prettifyMarkup,
      indent: 2,
    },
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupNumericValues: {
              floatPrecision: settings.numberPrecision,
            },
            removeViewBox: false,
          },
        },
      },
      ...(settings.removeDimensions ? [{ name: 'removeDimensions' as const }] : []),
    ],
  });

  return result.data;
}
