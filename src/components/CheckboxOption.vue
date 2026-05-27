<template>
  <label class="checkbox-option">
    <input
      type="checkbox"
      class="checkbox-option__input"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span v-if="name || hint" class="checkbox-option__content">
      <span v-if="name" class="checkbox-option__name">{{ name }}</span>
      <span v-if="hint" class="checkbox-option__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
  defineProps<{
    modelValue: boolean;
    name: string;
    hint?: string;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
  }>();
</script>

<style>
  .checkbox-option {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
  }

  .checkbox-option__input {
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: var(--accent-color);
  }

  .checkbox-option__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .checkbox-option__name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    color: var(--text-main-color);
  }

  .checkbox-option__hint {
    font-size: 0.78rem;
    color: var(--text-secondary-color);
    opacity: 0.75;
  }
</style>
