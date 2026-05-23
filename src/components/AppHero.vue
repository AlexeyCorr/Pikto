<template>
  <section class="hero">
    <p class="hero__meta">{{ t.hero.meta }}</p>
    <h1 class="hero__title" title="It's a trap!">Pikto</h1>
    <p class="hero__lead">{{ t.hero.lead }}</p>
    <TerminalPrompt path="~/pikto" command="compress assets --to webp,avif" />
  </section>
</template>

<script setup lang="ts">
  import { t } from '@/app/i18n';
  import TerminalPrompt from './TerminalPrompt.vue';
</script>

<style>
  .hero {
    display: grid;
    gap: var(--space-2);
    padding: var(--space-5) 0 var(--space-4);
    border-bottom: 1px solid var(--divider-color);
  }

  .hero__meta {
    margin: 0;
    color: var(--text-secondary-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .hero__title {
    margin: 0;
    font-family: 'Dela Gothic One', sans-serif;
    font-size: clamp(3.5rem, 9vw, 7rem);
    line-height: 0.92;
    letter-spacing: -0.01em;
  }

  .hero__lead {
    max-width: 42rem;
    margin: 0;
    color: var(--text-secondary-color);
    font-size: 1.05rem;
  }
</style>
