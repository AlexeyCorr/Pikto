<template>
  <section class="settings-panel">
    <template v-if="mode === 'raster'">
      <RangeControl
        id="quality"
        :label="t.settingsPanel.quality"
        :min="1"
        :max="100"
        :model-value="raster.quality"
        :display-value="`${raster.quality}%`"
        @update:model-value="emit('updateRasterQuality', $event)"
      />

      <fieldset class="settings-panel__group settings-panel__formats">
        <legend class="settings-panel__legend">{{ t.settingsPanel.outputFormats }}</legend>
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
          <RangeControl
            id="webp-method"
            :label="t.settingsPanel.webpEffort"
            :min="1"
            :max="6"
            :model-value="raster.webpMethod"
            :display-value="`${raster.webpMethod} / 6`"
            :hint="t.settingsPanel.webpHint"
            @update:model-value="emit('updateWebpMethod', $event)"
          />

          <RangeControl
            id="avif-effort"
            :label="t.settingsPanel.avifEffort"
            :min="0"
            :max="10"
            :model-value="raster.avifEffort"
            :display-value="`${raster.avifEffort} / 10`"
            :hint="t.settingsPanel.avifHint"
            @update:model-value="emit('updateAvifEffort', $event)"
          />

          <RangeControl
            id="png-effort"
            :label="t.settingsPanel.pngEffort"
            :min="1"
            :max="6"
            :model-value="raster.pngEffort"
            :display-value="`${raster.pngEffort} / 6`"
            :hint="t.settingsPanel.pngHint"
            @update:model-value="emit('updatePngEffort', $event)"
          />

          <fieldset class="settings-panel__group settings-panel__formats">
            <legend class="settings-panel__legend">{{ t.settingsPanel.resize }}</legend>
            <ResizeControl
              :width="raster.resize.width"
              :height="raster.resize.height"
              :locked="raster.resize.linked"
              :disabled="fileCount !== 1"
              @update:width="emit('updateResizeWidth', $event)"
              @update:height="emit('updateResizeHeight', $event)"
              @update:locked="emit('updateResizeLocked', $event)"
            />
          </fieldset>
        </div>
      </details>
    </template>

    <template v-else-if="mode === 'vector'">
      <RangeControl
        id="precision"
        :label="t.settingsPanel.coordPrecision"
        :min="0"
        :max="8"
        :model-value="vector.numberPrecision"
        :display-value="`${vector.numberPrecision}`"
        :hint="t.settingsPanel.precisionHint"
        @update:model-value="emit('updateVectorPrecision', $event)"
      />

      <fieldset class="settings-panel__group settings-panel__formats">
        <legend class="settings-panel__legend">{{ t.settingsPanel.options }}</legend>
        <div class="settings-panel__svg-options">
          <CheckboxOption
            :model-value="vector.prettifyMarkup"
            :name="t.settingsPanel.prettifyMarkup"
            :hint="t.settingsPanel.prettifyHint"
            @update:model-value="emit('updateVectorPrettify', $event)"
          />

          <CheckboxOption
            :model-value="vector.removeDimensions"
            :name="t.settingsPanel.removeDimensions"
            :hint="t.settingsPanel.removeDimensionsHint"
            @update:model-value="emit('updateVectorRemoveDimensions', $event)"
          />
        </div>
      </fieldset>
    </template>

    <template v-else>
      <fieldset class="settings-panel__group settings-panel__formats">
        <legend class="settings-panel__legend">{{ t.settingsPanel.outputFormats }}</legend>
        <div class="settings-panel__format-options">
          <label class="settings-panel__format-option settings-panel__format-option--original">
            <input
              type="checkbox"
              :checked="video.includeOriginal"
              @change="emit('updateVideoIncludeOriginal', ($event.target as HTMLInputElement).checked)"
            />
            {{ t.settingsPanel.original }}
          </label>
          <span class="settings-panel__format-divider"></span>
          <label v-for="format in VIDEO_EXTRA_FORMATS" :key="format" class="settings-panel__format-option">
            <input
              type="checkbox"
              :checked="video.selectedFormats.includes(format)"
              @change="emit('toggleVideoFormat', format)"
            />
            {{ format.toUpperCase() }}
          </label>
          <span v-for="format in VIDEO_COMING_SOON_FORMATS" :key="format" class="settings-panel__format-option settings-panel__format-option--coming-soon">
            {{ format.toUpperCase() }}
            <span class="settings-panel__coming-soon-badge">{{ t.settingsPanel.videoFormatComingSoon }}</span>
          </span>
        </div>
      </fieldset>

      <fieldset class="settings-panel__group settings-panel__formats">
        <legend class="settings-panel__legend">{{ t.settingsPanel.compressionPreset }}</legend>
        <div class="settings-panel__format-options">
          <label v-for="preset in VIDEO_COMPRESSION_PRESETS" :key="preset" class="settings-panel__format-option">
            <input
              type="radio"
              name="video-preset"
              :checked="video.compressionPreset === preset"
              @change="emit('updateVideoPreset', preset)"
            />
            {{
              preset === 'high'
                ? t.settingsPanel.presetHigh
                : preset === 'balanced'
                  ? t.settingsPanel.presetBalanced
                  : t.settingsPanel.presetSmall
            }}
          </label>
        </div>
      </fieldset>
    </template>
  </section>
</template>

<script setup lang="ts">
  import { t } from '@/app/i18n';
  import { RASTER_EXTRA_FORMATS, VIDEO_COMING_SOON_FORMATS, VIDEO_COMPRESSION_PRESETS, VIDEO_EXTRA_FORMATS } from '@/app/constants';
  import type {
    Mode,
    RasterFormat,
    RasterSettings,
    VectorSettings,
    VideoCompressionPreset,
    VideoFormat,
    VideoSettings,
  } from '@/app/types';
  import RangeControl from './RangeControl.vue';
  import CheckboxOption from './CheckboxOption.vue';
  import ResizeControl from './ResizeControl.vue';

  defineProps<{
    mode: Mode;
    raster: RasterSettings;
    vector: VectorSettings;
    video: VideoSettings;
    sourceImageSize: { width: number; height: number } | null;
    fileCount: number;
  }>();

  const emit = defineEmits<{
    updateRasterQuality: [value: number];
    updateIncludeOriginal: [value: boolean];
    toggleRasterFormat: [value: RasterFormat];
    updateWebpMethod: [value: number];
    updateAvifEffort: [value: number];
    updatePngEffort: [value: number];
    updateResizeWidth: [value: number | null];
    updateResizeHeight: [value: number | null];
    updateResizeLocked: [value: boolean];
    updateVectorPrecision: [value: number];
    updateVectorPrettify: [value: boolean];
    updateVectorRemoveDimensions: [value: boolean];
    updateVideoIncludeOriginal: [value: boolean];
    toggleVideoFormat: [value: VideoFormat];
    updateVideoPreset: [value: VideoCompressionPreset];
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

  .settings-panel__legend {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: var(--text-secondary-color);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0 6px;
  }

  .settings-panel__formats {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-2);
    margin: 0;
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

  .settings-panel__format-option--coming-soon {
    opacity: 0.4;
    cursor: default;
    gap: 5px;
  }

  .settings-panel__coming-soon-badge {
    font-size: 0.65rem;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 999px;
    padding: 1px 5px;
    line-height: 1.4;
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
