import { describe, expect, it } from 'vitest';
import { optimizeSvgText } from './process-svg';

describe('optimizeSvgText', () => {
  it('reduces svg noise and preserves svg tag', async () => {
    const source = '<svg width="10" height="10"><g><path d="M 0 0 L 10 10"></path></g></svg>';

    const result = await optimizeSvgText(source, {
      prettifyMarkup: false,
      numberPrecision: 2,
      removeDimensions: false,
    });

    expect(result).toContain('<svg');
    expect(result.length).toBeLessThan(source.length);
  });
});
