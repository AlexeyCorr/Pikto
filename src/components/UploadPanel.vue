<template>
  <section class="upload-panel">
    <div
      class="upload-panel__dropzone"
      :class="{
        'upload-panel__dropzone--dragging': isDragging,
        'upload-panel__dropzone--compact': files.length > 0,
      }"
      role="button"
      tabindex="0"
      :aria-label="files.length > 0 ? t.uploadPanel.ariaWithFiles(files.length) : t.uploadPanel.ariaEmpty"
      @click="triggerInput"
      @keydown.enter.space.prevent="triggerInput"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <input
        ref="inputRef"
        class="upload-panel__input"
        type="file"
        multiple
        :accept="
          mode === 'vector'
            ? '.svg,image/svg+xml'
            : mode === 'video'
              ? '.mp4,.avi,video/mp4,video/x-msvideo'
              : '.jpg,.jpeg,.png,.webp,.avif'
        "
        @change="onChange"
      />

      <template v-if="files.length === 0">
        <svg class="upload-panel__icon" :class="{ 'upload-panel__icon--dropping': isDragging }" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" title="Accio files!">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17,8 12,3 7,8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p class="upload-panel__drop-label">
          {{ isDragging ? t.uploadPanel.dropping : t.uploadPanel.dropHere }}
        </p>
        <p class="upload-panel__choose-hint">{{ t.uploadPanel.orText }} <span class="upload-panel__choose-link">{{ t.uploadPanel.clickToChoose }}</span></p>
        <p class="upload-panel__format-hint">
          {{ mode === 'vector' ? t.uploadPanel.svgOnly : mode === 'video' ? t.uploadPanel.videoFormats : t.uploadPanel.rasterFormats }}
          <span class="upload-panel__format-hint-sep">·</span>
          {{ t.uploadPanel.maxSize(formatBytes(MAX_FILE_SIZE[mode])) }}
        </p>
      </template>

      <template v-else>
        <svg class="upload-panel__icon upload-panel__icon--add" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17,8 12,3 7,8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p class="upload-panel__drop-label upload-panel__drop-label--compact">
          {{ isDragging ? t.uploadPanel.dropToAdd : t.uploadPanel.addMore }}
        </p>
      </template>
    </div>

    <ul v-if="files.length > 0" class="upload-panel__files">
      <li
        v-for="(file, index) in files"
        :key="`${file.name}-${file.size}`"
        class="upload-panel__file-item"
      >
        <span class="upload-panel__file-name" :title="file.name">{{ file.name }}</span>
        <span class="upload-panel__file-size">{{ formatBytes(file.size) }}</span>
        <button
          type="button"
          class="upload-panel__file-remove"
          :aria-label="`${t.uploadPanel.removeFile}: ${file.name}`"
          @click.stop="emit('removeFile', index)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </li>
    </ul>

    <details v-if="props.rejectedFiles.length > 0" class="upload-panel__files-disclosure upload-panel__files-disclosure--error">
      <summary class="upload-panel__files-summary">
        {{ t.uploadPanel.filesRejectedSummary(props.rejectedFiles.length) }}
      </summary>
      <ul class="upload-panel__rejected">
        <li v-for="item in props.rejectedFiles" :key="`${item.file.name}-${item.reason}`">
          {{ item.file.name }} — {{ item.reason }}
        </li>
      </ul>
    </details>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { t } from '@/app/i18n';
  import { MAX_FILE_SIZE } from '@/app/constants';
  import { formatBytes } from '@/app/utils/files';
  import type { Mode, RejectedFile } from '@/app/types';

  const props = defineProps<{
    mode: Mode;
    files: File[];
    rejectedFiles: RejectedFile[];
  }>();

  const emit = defineEmits<{
    selectFiles: [files: File[]];
    removeFile: [index: number];
  }>();

  const inputRef = ref<HTMLInputElement | null>(null);
  const dragCounter = ref(0);
  const isDragging = computed(() => dragCounter.value > 0);

  function triggerInput() {
    inputRef.value?.click();
  }

  function emitFiles(fileList: FileList | null) {
    emit('selectFiles', Array.from(fileList ?? []));
    // Reset the input so the same file selection re-triggers onChange next time
    if (inputRef.value) {
      inputRef.value.value = '';
    }
  }

  function onChange(event: Event) {
    emitFiles((event.target as HTMLInputElement).files);
  }

  function onDragEnter(event: DragEvent) {
    event.preventDefault();
    dragCounter.value++;
  }

  function onDragLeave(event: DragEvent) {
    event.preventDefault();
    dragCounter.value--;
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    dragCounter.value = 0;
    emitFiles(event.dataTransfer?.files ?? null);
  }
</script>

<style>
  .upload-panel {
    display: grid;
    gap: var(--space-2);
  }

  .upload-panel__dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: var(--space-4) var(--space-3);
    min-height: 160px;
    border: 1.5px dashed var(--border-color);
    border-radius: var(--radius-md);
    background: color-mix(in oklch, var(--surface-2) 70%, transparent);
    cursor: pointer;
    text-align: center;
    transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease, min-height 0.2s ease, padding 0.2s ease;
    outline: none;
    user-select: none;
  }

  .upload-panel__dropzone--compact {
    min-height: 0;
    padding: 10px var(--space-3);
    flex-direction: row;
    gap: 8px;
    border-style: dashed;
  }

  .upload-panel__dropzone:focus-visible {
    box-shadow: 0 0 0 2px var(--accent-color);
  }

  .upload-panel__dropzone:hover {
    border-color: color-mix(in oklch, var(--accent-color) 50%, var(--border-color));
    background: color-mix(in oklch, var(--surface-2) 85%, transparent);
  }

  .upload-panel__dropzone--dragging {
    border-style: solid;
    border-color: var(--accent-color);
    background: color-mix(in oklch, var(--accent-color) 6%, var(--surface-2));
    box-shadow: 0 0 0 4px color-mix(in oklch, var(--accent-color) 12%, transparent);
  }

  .upload-panel__input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .upload-panel__icon {
    color: var(--text-secondary-color);
    margin-bottom: 4px;
    flex-shrink: 0;
    transition: transform 0.15s ease, color 0.15s ease;
  }

  .upload-panel__icon--add {
    margin-bottom: 0;
    color: var(--text-secondary-color);
  }

  .upload-panel__dropzone--dragging .upload-panel__icon {
    transform: translateY(-4px);
    color: var(--accent-color);
  }

  .upload-panel__dropzone--compact.upload-panel__dropzone--dragging .upload-panel__icon {
    transform: none;
  }

  .upload-panel__drop-label {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-main-color);
  }

  .upload-panel__drop-label--compact {
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--text-secondary-color);
  }

  .upload-panel__choose-hint {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary-color);
  }

  .upload-panel__choose-link {
    color: var(--accent-text-color);
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 2px;
  }

  .upload-panel__format-hint {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-secondary-color);
    font-family: 'JetBrains Mono', monospace;
    margin-top: 4px;
  }

  .upload-panel__format-hint-sep {
    margin-inline: 4px;
    opacity: 0.4;
  }

  .upload-panel__files {
    display: grid;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    max-height: 155px;
    overflow-y: auto;
  }

  .upload-panel__file-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--card-bg-color);
    border-bottom: 1px solid var(--divider-color);
  }

  .upload-panel__file-item:last-child {
    border-bottom: none;
  }

  .upload-panel__file-name {
    flex: 1;
    min-width: 0;
    font-size: 0.85rem;
    color: var(--text-main-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .upload-panel__file-size {
    flex-shrink: 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    color: var(--text-secondary-color);
  }

  .upload-panel__file-remove {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--text-secondary-color);
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease;
  }

  .upload-panel__file-remove:hover {
    background: color-mix(in oklch, var(--accent-color) 10%, transparent);
    color: var(--accent-text-color);
  }

  .upload-panel__files-disclosure {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface-2);
    overflow: hidden;
  }

  .upload-panel__files-disclosure--error {
    border-color: color-mix(in oklch, var(--accent-color) 40%, var(--border-color));
  }

  .upload-panel__files-summary {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px var(--space-2);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    color: var(--text-secondary-color);
    cursor: pointer;
    user-select: none;
    list-style: none;
  }

  .upload-panel__files-summary::before {
    content: '▶';
    display: inline-block;
    font-size: 0.6rem;
    transition: transform 0.15s ease;
    color: var(--text-secondary-color);
  }

  .upload-panel__files-disclosure[open] .upload-panel__files-summary::before {
    transform: rotate(90deg);
  }

  .upload-panel__files-disclosure--error .upload-panel__files-summary {
    color: var(--accent-text-color);
  }

  .upload-panel__rejected {
    display: grid;
    gap: 6px;
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
    padding: 0 var(--space-2) var(--space-2);
    list-style: none;
    color: var(--text-secondary-color);
    font-size: 0.875rem;
  }
</style>
