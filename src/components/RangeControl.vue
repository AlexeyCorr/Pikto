<template>
  <div class="range-control">
    <div class="range-control__row">
      <label :for="id" class="range-control__label">{{ label }}</label>
      <output class="range-control__value">{{ displayValue }}</output>
    </div>
    <input
      :id="id"
      type="range"
      class="range-control__input"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
    <p v-if="hint" class="range-control__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    id: string;
    label: string;
    min: number;
    max: number;
    modelValue: number;
    displayValue: string;
    hint?: string;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: number];
  }>();
</script>

<style>
  .range-control {
    display: grid;
    gap: 10px;
  }

  .range-control__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .range-control__label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: var(--text-secondary-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .range-control__value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    color: var(--text-main-color);
  }

  .range-control__input {
    cursor: pointer;
    width: 100%;
    accent-color: var(--accent-color);
  }

  .range-control__hint {
    margin: 0;
    font-size: 0.78rem;
    color: var(--text-secondary-color);
    opacity: 0.75;
  }
</style>
