import { render, screen } from '@testing-library/vue';
import { beforeEach } from 'vitest';
import App from './App.vue';
import { setLocale } from '@/app/i18n';

beforeEach(() => {
  setLocale('en');
});

describe('App shell', () => {
  it('renders the refreshed hero and workspace copy', () => {
    render(App);

    expect(screen.getByText(/tool = "media optimization"/i)).toBeInTheDocument();
    expect(screen.getByText(/Right in your browser/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /optimize files/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /raster/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /vector/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /results/i, level: 2 })).toBeInTheDocument();
  });
});
