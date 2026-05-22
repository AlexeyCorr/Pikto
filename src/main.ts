import { createApp } from 'vue';
import App from './App.vue';
import { detectLocale, setLocale } from './app/i18n';
import './styles/base.css';

const applyTheme = (): void => {
  let stored: string | null = null;
  try { stored = localStorage.getItem('currentTheme'); } catch { /* ignore */ }
  const theme = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
};

applyTheme();
setLocale(detectLocale());

createApp(App).mount('#app');
