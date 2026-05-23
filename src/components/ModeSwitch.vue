<template>
  <div class="mode-switch" role="tablist" :aria-label="t.modeSwitch.ariaLabel">
    <button
      type="button"
      class="mode-switch__button"
      :class="{ 'mode-switch__button--active': modelValue === 'raster' }"
      :aria-pressed="modelValue === 'raster'"
      @click="emit('update:modelValue', 'raster')"
    >
      {{ t.modeSwitch.raster }}
    </button>

    <button
      type="button"
      class="mode-switch__button"
      :class="{ 'mode-switch__button--active': modelValue === 'vector' }"
      :aria-pressed="modelValue === 'vector'"
      @click="emit('update:modelValue', 'vector')"
    >
      {{ t.modeSwitch.vector }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { t } from '@/app/i18n';
  import type { Mode } from '@/app/types';

  defineProps<{
    modelValue: Mode;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: Mode];
  }>();
</script>

<style>
  .mode-switch {
    display: inline-flex;
    gap: 10px;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 999px;
    background: var(--surface-2);
  }

  .mode-switch__button {
    border: 0;
    border-radius: 999px;
    padding: 10px 18px;
    background: transparent;
    color: var(--text-secondary-color);
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
  }

  .mode-switch__button--active {
    background: var(--accent-color);
    color: white;
  }
</style>
