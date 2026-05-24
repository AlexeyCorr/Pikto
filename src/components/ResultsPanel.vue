<template>
  <section class="results-panel" aria-labelledby="results-title">
    <div class="results-panel__header">
      <div>
        <h2 id="results-title">{{ t.resultsPanel.title }}</h2>
        <p v-if="!summary">{{ t.resultsPanel.emptyHint }}</p>
        <p v-else class="results-panel__summary-line">
          <span>{{ t.resultsPanel.files(summary.inputCount) }}</span>
          <span class="results-panel__summary-dot">·</span>
          <span>{{ t.resultsPanel.outputs(summary.outputCount) }}</span>
          <span class="results-panel__summary-dot">·</span>
          <span :class="['results-panel__avg-saved', avgSavedClass]">
            {{ summary.avgSavedPercent >= 0 ? t.resultsPanel.savedAvg(summary.avgSavedPercent) : t.resultsPanel.largerAvg(Math.abs(summary.avgSavedPercent)) }}
          </span>
        </p>
      </div>

      <button
        v-if="summary"
        type="button"
        class="results-panel__download-all"
        @click="$emit('downloadAll')"
      >
        {{ t.resultsPanel.downloadAll }}
      </button>
    </div>

    <p v-if="results.length === 0" class="results-panel__empty">
      {{ t.resultsPanel.empty }}
    </p>

    <div v-for="(group, key) in grouped" :key="key" class="results-panel__group">
      <p class="results-panel__filename">{{ group.label }}</p>
      <div class="results-panel__rows">
        <div v-for="item in group.items" :key="item.id" class="results-panel__row">
          <span class="results-panel__format-badge">{{ item.targetFormat.toUpperCase() }}</span>
          <span class="results-panel__size-info">
            {{ formatBytes(item.originalBytes) }}
            <span class="results-panel__arrow">→</span>
            {{ item.status === 'success' ? formatBytes(item.outputBytes) : '—' }}
          </span>
          <template v-if="item.status === 'success'">
            <span :class="['results-panel__savings-badge', savingsClass(item.savedPercent)]">
              {{ item.savedPercent >= 0 ? item.savedPercent + '%' : '+' + Math.abs(item.savedPercent) + '%' }}
            </span>
          </template>
          <template v-else>
            <span class="results-panel__error-badge">{{ t.resultsPanel.error }}</span>
            <span class="results-panel__error-msg">{{ item.errorMessage ?? t.resultsPanel.processingFailed }}</span>
          </template>
          <button
            v-if="item.status === 'success'"
            type="button"
            class="results-panel__download-one"
            @click="$emit('downloadOne', item)"
          >
            {{ t.resultsPanel.download }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { t } from '@/app/i18n';
  import { formatBytes } from '@/app/utils/files';
  import type { BatchSummary, JobOutput } from '@/app/types';

  const props = defineProps<{
    results: JobOutput[];
    summary: BatchSummary | null;
  }>();

  defineEmits<{
    downloadAll: [];
    downloadOne: [result: JobOutput];
  }>();

  const grouped = computed(() => {
    return props.results.reduce<Record<string, { label: string; items: JobOutput[] }>>((acc, item) => {
      const key = `${item.sourceIndex}::${item.sourceFileName}`;
      (acc[key] ??= { label: item.sourceFileName, items: [] }).items.push(item);
      return acc;
    }, {});
  });

  const avgSavedClass = computed(() => {
    if (!props.summary) return '';
    const p = props.summary.avgSavedPercent;
    if (p >= 15) return 'results-panel__avg-saved--good';
    if (p >= 5) return 'results-panel__avg-saved--ok';
    if (p >= 0) return 'results-panel__avg-saved--neutral';

    return 'results-panel__avg-saved--bad';
  });

  function savingsClass(percent: number) {
    if (percent >= 15) return 'results-panel__savings-badge--good';
    if (percent >= 5) return 'results-panel__savings-badge--ok';
    if (percent >= 0) return 'results-panel__savings-badge--neutral';

    return 'results-panel__savings-badge--bad';
  }
</script>

<style>
  .results-panel {
    display: grid;
    gap: var(--space-3);
    padding: var(--space-4);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--card-bg-color);
    box-shadow: var(--shadow-soft);
  }

  .results-panel__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .results-panel__header h2,
  .results-panel__header p {
    margin: 0;
  }

  .results-panel__header h2 {
    margin-bottom: 6px;
  }

  .results-panel__summary-line {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    color: var(--text-secondary-color);
  }

  .results-panel__summary-dot {
    color: var(--border-color);
  }

  .results-panel__avg-saved {
    font-weight: 500;
    border-radius: 999px;
    padding: 1px 8px;
    font-size: 0.85rem;
  }

  .results-panel__avg-saved--good { color: oklch(35% 0.12 145); background: oklch(92% 0.06 145); }
  .results-panel__avg-saved--ok   { color: oklch(38% 0.1 80);  background: oklch(93% 0.05 80); }
  .results-panel__avg-saved--neutral { color: var(--text-secondary-color); background: var(--surface-2); }
  .results-panel__avg-saved--bad  { color: oklch(38% 0.12 20);  background: oklch(93% 0.05 20); }

  .results-panel__download-all {
    flex-shrink: 0;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    padding: 8px 16px;
    background: var(--card-bg-color);
    color: var(--text-main-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
  }

  .results-panel__download-all:hover {
    background: var(--surface-2);
  }

  .results-panel__empty {
    margin: 0;
    color: var(--text-secondary-color);
  }

  .results-panel__group {
    display: grid;
    gap: 6px;
  }

  .results-panel__filename {
    margin: 0;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-main-color);
  }

  .results-panel__rows {
    display: grid;
    gap: 1px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--border-color);
  }

  .results-panel__row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: var(--card-bg-color);
  }

  .results-panel__format-badge {
    min-width: 44px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary-color);
    letter-spacing: 0.04em;
  }

  .results-panel__size-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    color: var(--text-secondary-color);
  }

  .results-panel__arrow {
    color: var(--border-color);
  }

  .results-panel__savings-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 999px;
    padding: 2px 8px;
  }

  .results-panel__savings-badge--good    { color: oklch(35% 0.12 145); background: oklch(92% 0.06 145); }
  .results-panel__savings-badge--ok      { color: oklch(38% 0.1 80);   background: oklch(93% 0.05 80); }
  .results-panel__savings-badge--neutral { color: var(--text-secondary-color); background: var(--surface-2); }
  .results-panel__savings-badge--bad     { color: oklch(38% 0.12 20);  background: oklch(93% 0.05 20); }

  .results-panel__error-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 999px;
    padding: 2px 8px;
    color: oklch(38% 0.12 20);
    background: oklch(93% 0.05 20);
  }

  .results-panel__error-msg {
    flex: 1;
    font-size: 0.82rem;
    color: var(--text-secondary-color);
  }

  .results-panel__download-one {
    flex-shrink: 0;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    padding: 4px 12px;
    background: var(--card-bg-color);
    color: var(--text-main-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  .results-panel__download-one:hover {
    background: var(--surface-2);
  }

  [data-theme='dark'] .results-panel__avg-saved--good { color: oklch(70% 0.14 145); background: oklch(25% 0.06 145); }
  [data-theme='dark'] .results-panel__avg-saved--ok   { color: oklch(70% 0.1 80);  background: oklch(25% 0.05 80); }
  [data-theme='dark'] .results-panel__avg-saved--bad  { color: oklch(70% 0.12 20); background: oklch(25% 0.05 20); }

  [data-theme='dark'] .results-panel__savings-badge--good { color: oklch(70% 0.14 145); background: oklch(25% 0.06 145); }
  [data-theme='dark'] .results-panel__savings-badge--ok   { color: oklch(70% 0.1 80);   background: oklch(25% 0.05 80); }
  [data-theme='dark'] .results-panel__savings-badge--bad  { color: oklch(70% 0.12 20);  background: oklch(25% 0.05 20); }
  [data-theme='dark'] .results-panel__error-badge         { color: oklch(70% 0.12 20);  background: oklch(25% 0.05 20); }
</style>
