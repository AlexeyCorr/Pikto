import { render, screen } from '@testing-library/vue';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '@/App.vue';
import { setLocale } from '@/app/i18n';

beforeEach(() => {
  setLocale('en');
});

describe('Easter eggs', () => {
  it('hero meta contains v1.21 — a nod to 1.21 gigawatts (Back to the Future)', () => {
    render(App);

    expect(screen.getByText(/v1\.21/)).toBeInTheDocument();
  });

  it('hero title carries an Admiral Ackbar tooltip (Star Wars)', () => {
    render(App);

    const heading = screen.getByRole('heading', { name: /pikto/i, level: 1 });
    expect(heading).toHaveAttribute('title', "It's a trap!");
  });

  it('upload icon carries an Accio spell tooltip (Harry Potter)', () => {
    render(App);

    const svg = document.querySelector('.upload-panel__icon');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('title')).toBe('Accio files!');
  });
});
