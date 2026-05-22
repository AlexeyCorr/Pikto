<template>
  <div class="terminal-prompt" aria-hidden="true">
    <span class="terminal-prompt__path">{{ path }}</span>
    <span class="terminal-prompt__sep">$</span>
    <span class="terminal-prompt__cmd">{{ command }}</span>
    <span class="terminal-prompt__cursor" aria-hidden="true">_</span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    path: string;
    command: string;
  }>();
</script>

<style>
  .terminal-prompt {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 14px 18px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: linear-gradient(180deg, var(--surface-2), var(--surface-3));
    box-shadow: var(--shadow-soft);
    color: var(--text-secondary-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
  }

  .terminal-prompt__path,
  .terminal-prompt__sep {
    color: var(--accent-text-color);
  }

  .terminal-prompt__cmd {
    color: var(--text-main-color);
  }

  .terminal-prompt__cursor {
    color: var(--accent-text-color);
    animation: terminal-blink 1.2s step-start infinite;
  }

  @keyframes terminal-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
</style>
