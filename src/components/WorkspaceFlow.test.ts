import { fireEvent, render, screen } from '@testing-library/vue';
import { beforeEach } from 'vitest';
import App from '@/App.vue';
import { setLocale } from '@/app/i18n';

beforeEach(() => {
  setLocale('en');
});

describe('Workspace flow', () => {
  it('lets the user switch to vector mode and see svg-only guidance', async () => {
    render(App);

    await fireEvent.click(screen.getByRole('button', { name: /vector/i }));

    expect(screen.getByText(/svg only/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/coordinate precision/i)).toBeInTheDocument();
  });

  it('lets the user switch to video mode and keeps the main Reducio CTA visible', async () => {
    render(App);

    await fireEvent.click(screen.getByRole('button', { name: /video/i }));

    expect(screen.getAllByText(/^mp4$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/webm/i)).toBeInTheDocument();
    expect(screen.getByText(/compression preset/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reducio!/i })).toBeInTheDocument();
  });
});
