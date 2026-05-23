<template>
  <section class="hero">
    <a v-if="backUrl" :href="backUrl" class="hero__back">
      alexeycorr.dev
    </a>

    <p class="hero__meta">{{ t.hero.meta }}</p>
    <h1 class="hero__title" title="It's a trap!">Pikto</h1>
    <p class="hero__lead">{{ t.hero.lead }}</p>
    <TerminalPrompt path="~/pikto" command="compress assets --to webp,avif" />
  </section>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { t } from '@/app/i18n';
  import TerminalPrompt from './TerminalPrompt.vue';

  const backUrl = ref<string | null>(null);

  onMounted(() => {
    try {
      const referrer = document.referrer;
      if (referrer && new URL(referrer).hostname.endsWith('alexeycorr.dev')) {
        backUrl.value = referrer;
      }
    } catch {
      // ignore
    }
  });
</script>

<style>
  .hero {
    position: relative;
    display: grid;
    gap: var(--space-2);
    padding: var(--space-5);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background:
      linear-gradient(180deg, var(--card-bg-color), color-mix(in oklch, var(--card-bg-color) 88%, var(--accent-glow))),
      linear-gradient(135deg, var(--accent-glow), transparent 55%);
    box-shadow: var(--shadow-soft);
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle, color-mix(in oklch, var(--border-color) 60%, transparent) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    opacity: 0.45;
    border-radius: inherit;
  }

  .hero::after {
    content: '✦ ✧ ✦';
    position: absolute;
    top: var(--space-3);
    right: var(--space-4);
    font-size: 0.65rem;
    color: color-mix(in oklch, var(--accent-text-color) 35%, transparent);
    letter-spacing: 6px;
    pointer-events: none;
    animation: hero-stars-pulse 4s ease-in-out infinite;
  }

  @keyframes hero-stars-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .hero__back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: fit-content;
    padding: 4px 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background-color: var(--surface-2);
    color: var(--text-secondary-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    text-decoration: none;
    transition: color 0.15s ease, background-color 0.15s ease;

    &::before {
        font-size: 0.9em;
        content: '←'
    }
  }

  .hero__back:hover {
    color: var(--text-main-color);
    background-color: var(--surface-3);
  }

  .hero__meta {
    margin: 0;
    color: var(--text-secondary-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .hero__title {
    margin: 0;
    font-family: 'Dela Gothic One', sans-serif;
    font-size: clamp(3rem, 7vw, 5.75rem);
    line-height: 0.95;
  }

  .hero__lead {
    max-width: 42rem;
    margin: 0;
    color: var(--text-secondary-color);
    font-size: 1.05rem;
  }
</style>
