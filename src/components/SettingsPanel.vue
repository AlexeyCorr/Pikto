<template>
  <section class="settings-panel">
    <template v-if="mode === 'raster'">
      <div class="settings-panel__group">
        <div class="settings-panel__row">
          <label for="quality" class="settings-panel__label">{{ t.settingsPanel.quality }}</label>
          <output class="settings-panel__value">{{ raster.quality }}%</output>
        </div>
        <input
          id="quality"
          type="range"
          class="settings-panel__range"
          min="1"
          max="100"
          :value="raster.quality"
          @input="emit('updateRasterQuality', Number(($event.target as HTMLInputElement).value))"
        />
      </div>

      <fieldset class="settings-panel__group settings-panel__formats">
        <legend class="settings-panel__label">{{ t.settingsPanel.outputFormats }}</legend>
        <div class="settings-panel__format-options">
          <label class="settings-panel__format-option settings-panel__format-option--original">
            <input
              type="checkbox"
              :checked="raster.includeOriginal"
              @change="emit('updateIncludeOriginal', ($event.target as HTMLInputElement).checked)"
            />
            {{ t.settingsPanel.original }}
          </label>
          <span class="settings-panel__format-divider"></span>
          <label v-for="format in RASTER_EXTRA_FORMATS" :key="format" class="settings-panel__format-option">
            <input
              type="checkbox"
              :checked="raster.selectedFormats.includes(format)"
              @change="emit('toggleRasterFormat', format)"
            />
            {{ format.toUpperCase() }}
          </label>
        </div>
      </fieldset>

      <details class="settings-panel__advanced">
        <summary class="settings-panel__advanced-summary">{{ t.settingsPanel.advancedCodec }}</summary>
        <div class="settings-panel__advanced-body">
          <div class="settings-panel__group">
            <div class="settings-panel__row">
              <label for="webp-method" class="settings-panel__label">{{ t.settingsPanel.webpEffort }}</label>
              <output class="settings-panel__value">{{ raster.webpMethod }} / 6</output>
            </div>
            <input
              id="webp-method"
              type="range"
              class="settings-panel__range"
              min="1"
              max="6"
              :value="raster.webpMethod"
              @input="emit('updateWebpMethod', Number(($event.target as HTMLInputElement).value))"
            />
            <p class="settings-panel__hint">{{ t.settingsPanel.webpHint }}</p>
          </div>

          <div class="settings-panel__group">
            <div class="settings-panel__row">
              <label for="avif-speed" class="settings-panel__label">{{ t.settingsPanel.avifSpeed }}</label>
              <output class="settings-panel__value">{{ raster.avifSpeed }} / 10</output>
            </div>
            <input
              id="avif-speed"
              type="range"
              class="settings-panel__range"
              min="0"
              max="10"
              :value="raster.avifSpeed"
              @input="emit('updateAvifSpeed', Number(($event.target as HTMLInputElement).value))"
            />
            <p class="settings-panel__hint">{{ t.settingsPanel.avifHint }}</p>
          </div>
        </div>
      </details>
    </template>

    <template v-else>
      <div class="settings-panel__group">
        <div class="settings-panel__row">
          <label for="precision" class="settings-panel__label">{{ t.settingsPanel.coordPrecision }}</label>
          <output class="settings-panel__value">{{ vector.numberPrecision }}</output>
        </div>
        <input
          id="precision"
          type="range"
          class="settings-panel__range"
          min="0"
          max="8"
          :value="vector.numberPrecision"
          @input="emit('updateVectorPrecision', Number(($event.target as HTMLInputElement).value))"
        />
        <p class="settings-panel__hint">{{ t.settingsPanel.precisionHint }}</p>
      </div>

      <fieldset class="settings-panel__group settings-panel__formats">
        <legend class="settings-panel__label">{{ t.settingsPanel.options }}</legend>
        <div class="settings-panel__svg-options">
          <label class="settings-panel__svg-option">
            <input
              type="checkbox"
              :checked="vector.prettifyMarkup"
              @change="emit('updateVectorPrettify', ($event.target as HTMLInputElement).checked)"
            />
            <span>
              <span class="settings-panel__svg-option-name">{{ t.settingsPanel.prettifyMarkup }}</span>
              <span class="settings-panel__hint">{{ t.settingsPanel.prettifyHint }}</span>
            </span>
          </label>
          <label class="settings-panel__svg-option">
            <input
              type="checkbox"
              :checked="vector.removeDimensions"
              @change="emit('updateVectorRemoveDimensions', ($event.target as HTMLInputElement).checked)"
            />
            <span>
              <span class="settings-panel__svg-option-name">{{ t.settingsPanel.removeDimensions }}</span>
              <span class="settings-panel__hint">{{ t.settingsPanel.removeDimensionsHint }}</span>
            </span>
          </label>
        </div>
      </fieldset>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { t } from '@/app/i18n';
  import { RASTER_EXTRA_FORMATS } from '@/app/constants';
  import type {
    Mode,
    RasterFormat,
    RasterSettings,
    VectorSettings,
  } from '@/app/types';

  defineProps<{
    mode: Mode;
    raster: RasterSettings;
    vector: VectorSettings;
  }>();

  const emit = defineEmits<{
    updateRasterQuality: [value: number];
    updateIncludeOriginal: [value: boolean];
    toggleRasterFormat: [value: RasterFormat];
    updateWebpMethod: [value: number];
    updateAvifSpeed: [value: number];
    updateVectorPrecision: [value: number];
    updateVectorPrettify: [value: boolean];
    updateVectorRemoveDimensions: [value: boolean];
  }>();
</script>

<style>
  .settings-panel {
    display: grid;
    gap: var(--space-3);
  }

  .settings-panel__group {
    display: grid;
    gap: 10px;
  }

  .settings-panel__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .settings-panel__label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: var(--text-secondary-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .settings-panel__value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    color: var(--text-main-color);
  }

  .settings-panel__range {
    width: 100%;
    accent-color: var(--accent-color);
  }

  .settings-panel__hint {
    margin: 0;
    font-size: 0.78rem;
    color: var(--text-secondary-color);
    opacity: 0.75;
  }

  .settings-panel__formats {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-2);
    margin: 0;
  }

  .settings-panel__formats legend {
    padding: 0 6px;
  }

  .settings-panel__format-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .settings-panel__format-option {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .settings-panel__format-option--original {
    color: var(--text-secondary-color);
  }

  .settings-panel__format-divider {
    width: 1px;
    height: 16px;
    background: var(--border-color);
    flex-shrink: 0;
  }

  .settings-panel__svg-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .settings-panel__svg-option {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
  }

  .settings-panel__svg-option input[type='checkbox'] {
    margin-top: 2px;
    flex-shrink: 0;
    accent-color: var(--accent-color);
  }

  .settings-panel__svg-option span {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .settings-panel__svg-option-name {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    color: var(--text-main-color);
  }

  .settings-panel__advanced {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .settings-panel__advanced-summary {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px var(--space-2);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    color: var(--text-secondary-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    user-select: none;
    list-style: none;
  }

  .settings-panel__advanced-summary::-webkit-details-marker {
    display: none;
  }

  .settings-panel__advanced-summary::before {
    content: '▶';
    font-size: 0.6rem;
    transition: transform 0.15s;
    flex-shrink: 0;
  }

  .settings-panel__advanced[open] .settings-panel__advanced-summary::before {
    transform: rotate(90deg);
  }

  .settings-panel__advanced-body {
    display: grid;
    gap: var(--space-2);
    padding: var(--space-2);
    border-top: 1px solid var(--border-color);
  }
</style>
