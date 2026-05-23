<template>
  <header class="app-header">
    <a href="https://alexeycorr.dev" class="app-header__logo">~/alexeycorr.dev</a>

    <nav class="app-header__nav" aria-label="Site navigation">
      <div class="app-header__locale" role="group" aria-label="Language">
        <button
          type="button"
          class="app-header__locale-btn"
          :class="{ 'app-header__locale-btn--active': locale === 'ru' }"
          @click="switchLocale('ru')"
        >
          Ru
        </button>

        <button
          type="button"
          class="app-header__locale-btn"
          :class="{ 'app-header__locale-btn--active': locale === 'en' }"
          @click="switchLocale('en')"
        >
          En
        </button>
      </div>

      <button
        type="button"
        class="app-header__theme-btn"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggleTheme"
      >
        <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>

        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { locale, setLocale } from '@/app/i18n';
  import type { Locale } from '@/app/i18n/types';

  const theme = ref<'light' | 'dark' | 'auto'>('auto');

  const isDark = computed(() => {
    if (theme.value === 'dark') return true;
    if (theme.value === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  onMounted(() => {
    const saved = localStorage.getItem('pikto-theme') as 'light' | 'dark' | null;
    if (saved) {
      theme.value = saved;
      document.body.dataset.theme = saved;
    }
  });

  function toggleTheme() {
    const next = isDark.value ? 'light' : 'dark';
    theme.value = next;
    document.body.dataset.theme = next;
    localStorage.setItem('pikto-theme', next);
  }

  function switchLocale(l: Locale) {
    setLocale(l);
  }
</script>

<style>
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background-color: var(--bg-main-color);
    border-bottom: 1px solid var(--divider-color);
    transition: background-color 0.4s ease, border-color 0.4s ease;
    padding-inline: 16px;
    padding-bottom: 16px;
    padding-top: 16px;

    @media (min-width: 768px) {
      padding-inline: 48px;
    }

    @media (min-width: 1600px) {
      padding-inline: calc(50% - 770px);
    }
  }

  .app-header__logo {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    font-weight: 500;
    color: var(--text-main-color);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .app-header__logo:hover {
    color: var(--accent-color);
  }

  .app-header__nav {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .app-header__locale {
    display: flex;
    gap: 2px;
  }

  .app-header__locale-btn {
    border: 0;
    background: transparent;
    padding: 4px 8px;
    border-radius: 5px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--text-secondary-color);
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .app-header__locale-btn:hover {
    color: var(--text-main-color);
    background: var(--surface-2);
  }

  .app-header__locale-btn--active {
    color: var(--accent-text-color);
    font-weight: 600;
  }

  .app-header__theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid var(--border-color);
    border-radius: 7px;
    background: transparent;
    color: var(--text-secondary-color);
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  }

  .app-header__theme-btn:hover {
    color: var(--text-main-color);
    background: var(--surface-2);
    border-color: var(--accent-border);
  }
</style>
