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
      <div class="run-panel__progress-bar">
        <div
          class="run-panel__progress-fill"
          :style="{ width: `${(progress.completed / progress.total) * 100}%` }"
        ></div>
      </div>

      <p class="run-panel__progress-label">{{ progress.completed }} / {{ progress.total }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { t } from '@/app/i18n';

  defineProps<{
    fileCount: number;
    outputCount: number;
    disabled: boolean;
    processing: boolean;
    hasOutdatedResults: boolean;
    progress: { completed: number; total: number } | null;
  }>();

  defineEmits<{
    run: [];
  }>();
</script>

<style>
  .run-panel {
    display: grid;
    gap: var(--space-2);
    padding: var(--space-3);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface-2);
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
  }

  .run-panel__button {
    justify-self: start;
    border: 0;
    border-radius: 999px;
    padding: 12px 18px;
    background: var(--accent-color);
    color: white;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
  }

  .run-panel__button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .run-panel__progress {
    display: grid;
    gap: 6px;
  }

  .run-panel__progress-bar {
    height: 4px;
    border-radius: 999px;
    background: var(--border-color);
    overflow: hidden;
  }

  .run-panel__progress-fill {
    height: 100%;
    border-radius: 999px;
    background: var(--accent-color);
    transition: width 0.2s ease;
  }

  .run-panel__progress-label {
    margin: 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    color: var(--text-secondary-color);
  }
</style>
