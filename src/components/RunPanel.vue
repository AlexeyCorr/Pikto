<template>
  <section class="run-panel">
    <div class="run-panel__stats">
      <p>{{ t.runPanel.filesSelected(fileCount) }}</p>
      <p>{{ t.runPanel.outputsPlanned(outputCount) }}</p>
    </div>

    <p v-if="hasOutdatedResults" class="run-panel__warning">
      {{ t.runPanel.outdatedWarning }}
    </p>

    <button type="button" class="run-panel__button" :disabled="disabled" @click="$emit('run')">
      {{ processing ? t.runPanel.compressing : t.runPanel.compress }}
    </button>

    <div v-if="processing && progress" class="run-panel__progress" title="Great Scott!">
      <div class="run-panel__progress-header">
        <span class="run-panel__progress-pct">{{ Math.round(progressPct) }}%</span>
        <span class="run-panel__progress-count">{{ progress.completed }} / {{ progress.total }}</span>
      </div>

      <div class="run-panel__progress-bar">
        <div
          class="run-panel__progress-fill"
          :style="{ width: `${progressPct}%` }"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { t } from '@/app/i18n';

  const props = defineProps<{
    fileCount: number;
    outputCount: number;
    disabled: boolean;
    processing: boolean;
    hasOutdatedResults: boolean;
    progress: { completed: number; total: number; itemProgress: number } | null;
  }>();

  defineEmits<{
    run: [];
  }>();

  const progressPct = computed(() => {
    if (!props.progress || props.progress.total === 0) return 0;
    return ((props.progress.completed + props.progress.itemProgress) / props.progress.total) * 100;
  });
</script>

<style>
  .run-panel {
    display: grid;
    gap: var(--space-2);
    padding: var(--space-3);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface-2);

    @media (min-width: 768px) {
      grid-template-columns: 1fr auto;
    }
  }

  .run-panel__stats {
    display: grid;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
  }

  .run-panel__stats p,
  .run-panel__warning {
    margin: 0;
  }

  .run-panel__warning {
    color: var(--accent-text-color);

    @media (min-width: 768px) {
      grid-column: 1/-1;
      grid-row: 2/3;
    }
  }

  .run-panel__button {
    justify-self: start;
    min-height: 4rem;
    min-width: 16rem;
    border: 0;
    border-radius: 999px;
    padding: 14px 32px;
    background: var(--accent-color);
    color: var(--on-accent-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: background 0.18s ease;
    box-shadow:
      0 10px 22px color-mix(in oklch, var(--accent-color) 40%, transparent),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);

    @media (min-width: 768px) {
      grid-column: 2/3;
    }
  }

  .run-panel__button:hover:not(:disabled) {
    background: var(--accent-bg);
    box-shadow: 0 4px 16px color-mix(in oklch, var(--accent-color) 50%, transparent);
  }

  .run-panel__button:active:not(:disabled) {
    transform: translateY(0) scale(0.995);
    box-shadow:
      0 8px 18px color-mix(in oklch, var(--accent-color) 42%, transparent),
      inset 0 1px 0 rgba(255, 255, 255, 0.24);
  }

  .run-panel__button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }

  .run-panel__progress {
    display: grid;
    gap: 8px;

    @media (min-width: 768px) {
      grid-column: 1/-1;
    }
  }

  .run-panel__progress-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }

  .run-panel__progress-pct {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--accent-text-color);
  }

  .run-panel__progress-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--text-secondary-color);
  }

  .run-panel__progress-bar {
    height: 6px;
    border-radius: 999px;
    background: var(--border-color);
    overflow: hidden;
    position: relative;
  }

  .run-panel__progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--accent-color), color-mix(in oklch, var(--accent-color) 70%, white 30%));
    box-shadow: 0 0 8px color-mix(in oklch, var(--accent-color) 55%, transparent);
    transition: width 0.25s ease;
    position: relative;
    overflow: hidden;
  }

  .run-panel__progress-fill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.28) 50%, transparent 100%);
    animation: progress-shimmer 1.6s ease-in-out infinite;
    transform: translateX(-100%);
  }

  @keyframes progress-shimmer {
    100% { transform: translateX(250%); }
  }
</style>
