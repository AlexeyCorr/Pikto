import { render, screen } from '@testing-library/vue';
import { beforeEach } from 'vitest';
import App from './App.vue';
import { setLocale } from '@/app/i18n';

beforeEach(() => {
  setLocale('en');
});

describe('App shell', () => {
  it('renders the main workspace sections', () => {
    render(App);

    expect(screen.getByText(/image optimization/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /raster/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /vector/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /results/i, level: 2 })).toBeInTheDocument();
  });
});
