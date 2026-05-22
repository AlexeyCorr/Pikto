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
});
