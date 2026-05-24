<template>
  <AppHeader />
  <main class="app-shell">
    <AppHero />

    <section class="workspace" aria-labelledby="workspace-title">
      <div class="workspace__header">
        <div class="workspace__title-block">
          <p class="workspace__eyebrow">{{ t.workspace.eyebrow }}</p>
          <h2 id="workspace-title" class="workspace__title">{{ t.workspace.title }}</h2>
        </div>
        <ModeSwitch :model-value="state.mode.value" @update:model-value="handleModeChange" />
      </div>

      <div class="workspace__grid">
        <div class="workspace__section">
          <p class="workspace__step">01 — {{ t.workspace.stepFiles }}</p>
          <UploadPanel
            :mode="state.mode.value"
            :files="state.selectedFiles.value"
            :rejected-files="state.rejectedFiles.value"
            @select-files="handleSelectFiles"
            @remove-file="handleRemoveFile"
          />
        </div>

        <div class="workspace__section">
          <p class="workspace__step">02 — {{ t.workspace.stepSettings }}</p>
          <SettingsPanel
            :mode="state.mode.value"
            :raster="state.rasterSettings.value"
            :vector="state.vectorSettings.value"
            :video="state.videoSettings.value"
            :source-image-size="state.sourceImageSize.value"
            :file-count="state.selectedFiles.value.length"
            @update-raster-quality="state.setRasterQuality"
            @update-include-original="state.setIncludeOriginal"
            @toggle-raster-format="state.toggleRasterFormat"
            @update-webp-method="state.setWebpMethod"
            @update-avif-effort="state.setAvifEffort"
            @update-resize-width="state.setResizeWidth"
            @update-resize-height="state.setResizeHeight"
            @update-resize-locked="state.setResizeLocked"
            @update-vector-precision="state.setVectorPrecision"
            @update-vector-prettify="state.setVectorPrettify"
            @update-vector-remove-dimensions="state.setVectorRemoveDimensions"
            @update-video-include-original="state.setVideoIncludeOriginal"
            @toggle-video-format="state.toggleVideoFormat"
            @update-video-preset="state.setVideoPreset"
          />
        </div>
      </div>

      <div class="workspace__section workspace__section--run">
        <p class="workspace__step">03 — {{ t.workspace.stepRun }}</p>

        <RunPanel
          :file-count="state.selectedFiles.value.length"
          :output-count="plannedOutputCount"
          :disabled="state.selectedFiles.value.length === 0 || state.status.value === 'processing'"
          :processing="state.status.value === 'processing'"
          :has-outdated-results="state.hasOutdatedResults.value"
          :progress="workerProgress"
          @run="runCompression"
        />
      </div>
    </section>

    <ResultsPanel
      ref="resultsPanelRef"
      :results="state.results.value"
      :summary="batchSummary"
      @download-all="downloadAll"
      @download-one="downloadOne"
    />
  </main>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, ref, toRaw } from 'vue';
  import { t } from '@/app/i18n';
  import { usePiktoState } from '@/app/composables/usePiktoState';
  import { buildDownloadName, buildResultsArchive, triggerBlobDownload } from '@/app/utils/download';
  import { filterAcceptedFiles } from '@/app/utils/files';
  import type { BatchSummary, JobOutput, Mode } from '@/app/types';
  import type { WorkerRequest, WorkerResponse } from '@/app/worker/contracts';
  import MediaWorker from './app/worker/media.worker?worker';
  import AppHeader from '@/components/AppHeader.vue';
  import AppHero from '@/components/AppHero.vue';
  import ModeSwitch from '@/components/ModeSwitch.vue';
  import ResultsPanel from '@/components/ResultsPanel.vue';
  import RunPanel from '@/components/RunPanel.vue';
  import SettingsPanel from '@/components/SettingsPanel.vue';
  import UploadPanel from '@/components/UploadPanel.vue';

  const state = usePiktoState();
  const workerProgress = ref<{ completed: number; total: number; itemProgress: number } | null>(null);
  const resultsPanelRef = ref<InstanceType<typeof ResultsPanel> | null>(null);
  let worker: Worker | null = null;
  let selectRequestId = 0;

  const plannedOutputCount = computed(() => {
    if (state.mode.value === 'vector') {
      return state.selectedFiles.value.length;
    }

    if (state.mode.value === 'video') {
      return state.selectedFiles.value.length * state.videoOutputFormats.value.length;
    }

    return state.selectedFiles.value.length * state.outputFormats.value.length;
  });

  const batchSummary = computed<BatchSummary | null>(() => {
    if (state.results.value.length === 0) {
      return null;
    }

    const successfulResults = state.results.value.filter((item) => item.status === 'success');
    const originalBytesBySource = new Map<string, number>();

    for (const item of successfulResults) {
      if (!originalBytesBySource.has(item.sourceFileName)) {
        originalBytesBySource.set(item.sourceFileName, item.originalBytes);
      }
    }

    const avgSavedPercent =
      successfulResults.length > 0
        ? Math.round(
            successfulResults.reduce((sum, item) => sum + item.savedPercent, 0) /
              successfulResults.length,
          )
        : 0;

    return {
      inputCount: new Set(state.results.value.map((item) => item.sourceFileName)).size,
      outputCount: successfulResults.length,
      originalBytes: Array.from(originalBytesBySource.values()).reduce((sum, value) => sum + value, 0),
      outputBytes: successfulResults.reduce((sum, item) => sum + item.outputBytes, 0),
      avgSavedPercent,
    };
  });

  function getWorker() {
    if (!worker) {
      worker = new MediaWorker();
    }

    return worker;
  }

  function applyWorkerResults(results: JobOutput[]) {
    state.results.value = results.map((item) => ({
      ...item,
      savedPercent:
        item.originalBytes > 0
          ? Math.round((1 - item.outputBytes / item.originalBytes) * 100)
          : 0,
    }));
    state.hasOutdatedResults.value = false;
    state.status.value = state.results.value.some((item) => item.status === 'error')
      ? 'partial-success'
      : 'done';
  }

  function handleModeChange(nextMode: Mode) {
    if (state.status.value === 'processing') {
      return;
    }

    if (
      nextMode !== state.mode.value &&
      state.selectedFiles.value.length > 0 &&
      !window.confirm(t.value.workspace.modeChangeConfirm)
    ) {
      return;
    }

    if (nextMode !== state.mode.value) {
      state.clearFiles();
      state.clearResults();
      state.status.value = 'idle';
    }

    state.setMode(nextMode);

    if (nextMode === 'video' && typeof Worker !== 'undefined') {
      getWorker().postMessage({ type: 'warmup-video' } satisfies WorkerRequest);
    }
  }

  function handleRemoveFile(index: number) {
    state.removeFile(index);
  }

  async function handleSelectFiles(files: File[]) {
    const requestId = ++selectRequestId;

    const result = filterAcceptedFiles(state.mode.value, files);
    state.setSelectedFiles(result.accepted);
    state.setRejectedFiles(result.rejected);
    state.clearResults();
    state.hasOutdatedResults.value = false;
    state.status.value = result.accepted.length > 0 ? 'ready' : 'idle';

    if (state.mode.value === 'raster' && result.accepted.length === 1) {
      try {
        const bitmap = await createImageBitmap(result.accepted[0]);
        if (requestId !== selectRequestId) {
          bitmap.close();
          return;
        }
        state.sourceImageSize.value = { width: bitmap.width, height: bitmap.height };
        state.rasterSettings.value.resize.width = bitmap.width;
        state.rasterSettings.value.resize.height = bitmap.height;
        bitmap.close();
      } catch {
        if (requestId !== selectRequestId) return;
        state.sourceImageSize.value = null;
        state.rasterSettings.value.resize.width = null;
        state.rasterSettings.value.resize.height = null;
      }
    } else {
      state.sourceImageSize.value = null;
      state.rasterSettings.value.resize.width = null;
      state.rasterSettings.value.resize.height = null;
    }
  }

  function runCompression() {
    if (state.selectedFiles.value.length === 0) {
      return;
    }

    state.status.value = 'processing';
    state.results.value = [];
    state.hasOutdatedResults.value = false;
    workerProgress.value = null;

    const request: WorkerRequest = state.mode.value === 'vector'
      ? {
          type: 'process-vector-batch',
          jobs: state.selectedFiles.value.map((file, index) => ({
            id: `vector-${index}`,
            file: toRaw(file),
            settings: { ...state.vectorSettings.value },
          })),
        }
      : state.mode.value === 'video'
        ? {
            type: 'process-video-batch',
            jobs: state.selectedFiles.value.map((file, index) => ({
              id: `video-${index}`,
              file: toRaw(file),
              targetFormats: [...state.videoOutputFormats.value],
              settings: { ...toRaw(state.videoSettings.value) },
            })),
          }
        : {
            type: 'process-raster-batch',
            jobs: state.selectedFiles.value.map((file, index) => ({
              id: `raster-${index}`,
              file: toRaw(file),
              targetFormats: [...state.outputFormats.value],
              settings: { ...toRaw(state.rasterSettings.value) },
            })),
          };

    const currentWorker = getWorker();

    currentWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type === 'progress') {
        workerProgress.value = {
          completed: event.data.completed,
          total: event.data.total,
          itemProgress: event.data.itemProgress,
        };
      }

      if (event.data.type === 'done') {
        workerProgress.value = null;
        applyWorkerResults(event.data.results);
        nextTick(() => {
          resultsPanelRef.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }

      if (event.data.type === 'error') {
        workerProgress.value = null;
        state.status.value = 'error';
      }
    };

    currentWorker.onerror = () => {
      state.status.value = 'error';
    };

    currentWorker.postMessage(request);
  }

  async function downloadAll() {
    const archive = await buildResultsArchive(state.results.value);
    triggerBlobDownload(archive, 'pikto-results.zip');
  }

  function downloadOne(result: JobOutput) {
    if (!result.blob) {
      return;
    }

    triggerBlobDownload(result.blob, buildDownloadName(result.sourceFileName, result.targetFormat));
  }

  onBeforeUnmount(() => {
    worker?.terminate();
  });
</script>

<style>
  .app-shell {
    display: grid;
    gap: var(--space-4);
    padding-inline: 16px;
    max-width: 1280px;
    margin: 0 auto;

    @media (min-width: 768px) {
      padding-inline: 48px;
    }
  }

  .workspace {
    display: grid;
    gap: var(--space-3);
    padding: var(--space-4);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--card-bg-color);
    box-shadow: var(--shadow-soft);
    transition: background-color 0.4s ease, border-color 0.4s ease;
  }

  .workspace__header {
    display: grid;
    gap: var(--space-2);
    align-items: start;
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--divider-color);
  }

  .workspace__title-block {
    display: grid;
    gap: 4px;
  }

  .workspace__eyebrow {
    margin: 0;
    color: var(--text-secondary-color);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .workspace__title {
    margin: 0;
    font-family: 'Dela Gothic One', sans-serif;
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    line-height: 1;
  }

  .workspace__grid {
    display: grid;
    gap: var(--space-3);
    align-items: flex-start;
  }

  .workspace__section {
    display: grid;
    gap: 10px;
  }

  .workspace__section--run {
    margin-top: 4px;
  }

  .workspace__step {
    margin: 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    color: var(--text-secondary-color);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (min-width: 880px) {
    .workspace__header {
      grid-template-columns: 1fr auto;
    }

    .workspace__grid {
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
    }
  }
</style>
