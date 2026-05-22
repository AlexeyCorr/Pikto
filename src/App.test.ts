import { render, screen } from '@testing-library/vue';
import App from './App.vue';

describe('App', () => {
  it('renders the Pikto heading', () => {
    render(App);

    expect(
      screen.getByRole('heading', { name: /pikto/i, level: 1 }),
    ).toBeInTheDocument();
  });
});
