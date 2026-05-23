<template>
  <section class="upload-panel">
    <div
      class="upload-panel__dropzone"
      :class="{
        'upload-panel__dropzone--dragging': isDragging,
        'upload-panel__dropzone--has-files': files.length > 0,
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
              ? '.mp4,video/mp4'
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
        </p>
      </template>

      <template v-else>
        <svg class="upload-panel__icon upload-panel__icon--ready" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20,6 9,17 4,12" />
        </svg>
        <p class="upload-panel__drop-label">
          {{ isDragging ? t.uploadPanel.dropToReplace : t.uploadPanel.filesSelected(files.length) }}
        </p>
        <p class="upload-panel__choose-hint"><span class="upload-panel__choose-link">{{ t.uploadPanel.changeSelection }}</span></p>
      </template>
    </div>

    <details v-if="files.length > 0" class="upload-panel__files-disclosure">
      <summary class="upload-panel__files-summary">
        {{ t.uploadPanel.filesSelectedSummary(files.length) }}
      </summary>
      <ul class="upload-panel__files">
        <li v-for="file in files" :key="`${file.name}-${file.size}`">{{ file.name }}</li>
      </ul>
    </details>

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
  import type { Mode, RejectedFile } from '@/app/types';

  const props = defineProps<{
    mode: Mode;
    files: File[];
    rejectedFiles: RejectedFile[];
  }>();

  const emit = defineEmits<{
    selectFiles: [files: File[]];
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
    transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
    outline: none;
    user-select: none;
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

  .upload-panel__dropzone--has-files:not(.upload-panel__dropzone--dragging) {
    border-color: color-mix(in oklch, var(--accent-color) 45%, var(--border-color));
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
    transition: transform 0.15s ease, color 0.15s ease;
  }

  .upload-panel__dropzone--dragging .upload-panel__icon {
    transform: translateY(-4px);
    color: var(--accent-color);
  }

  .upload-panel__icon--ready {
    color: var(--accent-text-color);
  }

  .upload-panel__drop-label {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-main-color);
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

  .upload-panel__files,
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
