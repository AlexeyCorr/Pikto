<template>
  <div class="resize-control">
    <p v-if="disabled" class="resize-control__hint resize-control__hint--muted">
      {{ t.settingsPanel.resizeSingleFileOnly }}
    </p>

    <div class="resize-control__inputs">
      <label class="resize-control__field">
        <span class="resize-control__label">{{ t.settingsPanel.resizeWidth }}</span>
        <input
          type="number"
          class="resize-control__input"
          :value="width ?? ''"
          :disabled="disabled"
          min="1"
          step="1"
          @input="onWidthInput"
        />
        <span class="resize-control__unit">px</span>
      </label>

      <button
        type="button"
        class="resize-control__lock"
        :class="{ 'resize-control__lock--open': !locked }"
        :disabled="disabled"
        :aria-label="locked ? 'Unlink aspect ratio' : 'Link aspect ratio'"
        @click="$emit('update:locked', !locked)"
      >
        <svg v-if="locked" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="3" y="6" width="8" height="7" rx="1" stroke="currentColor" stroke-width="1.4" />
          <path d="M4.5 6V4a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="3" y="6" width="8" height="7" rx="1" stroke="currentColor" stroke-width="1.4" />
          <path d="M4.5 6V4a2.5 2.5 0 0 1 5 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
      </button>

      <label class="resize-control__field">
        <span class="resize-control__label">{{ t.settingsPanel.resizeHeight }}</span>
        <input
          type="number"
          class="resize-control__input"
          :value="height ?? ''"
          :disabled="disabled"
          min="1"
          step="1"
          @input="onHeightInput"
        />
        <span class="resize-control__unit">px</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { t } from '@/app/i18n';

  defineProps<{
    width: number | null;
    height: number | null;
    locked: boolean;
    disabled: boolean;
  }>();

  const emit = defineEmits<{
    'update:width': [value: number | null];
    'update:height': [value: number | null];
    'update:locked': [value: boolean];
  }>();

  function parseInput(value: string): number | null {
    const n = parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function onWidthInput(event: Event) {
    emit('update:width', parseInput((event.target as HTMLInputElement).value));
  }

  function onHeightInput(event: Event) {
    emit('update:height', parseInput((event.target as HTMLInputElement).value));
  }
</script>

<style>
  .resize-control {
    display: grid;
    gap: 8px;
  }

  .resize-control__hint {
    margin: 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: var(--text-secondary-color);
  }

  .resize-control__hint--muted {
    opacity: 0.6;
  }

  .resize-control__inputs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  .resize-control__field {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .resize-control__label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    color: var(--text-secondary-color);
    min-width: 12px;
  }

  .resize-control__input {
    width: 72px;
    padding: 5px 8px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--card-bg-color);
    color: var(--text-main-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    text-align: right;
    appearance: textfield;
  }

  .resize-control__input::-webkit-outer-spin-button,
  .resize-control__input::-webkit-inner-spin-button {
    appearance: none;
  }

  .resize-control__input:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .resize-control__unit {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    color: var(--text-secondary-color);
  }

  .resize-control__lock {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--accent-color);
    cursor: pointer;
    flex-shrink: 0;
    transition: color 0.15s, border-color 0.15s;
  }

  .resize-control__lock--open {
    color: var(--text-secondary-color);
  }

  .resize-control__lock:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
</style>
