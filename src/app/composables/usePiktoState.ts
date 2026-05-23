import { computed, ref } from 'vue';
import {
  DEFAULT_RASTER_SETTINGS,
  DEFAULT_VECTOR_SETTINGS,
} from '../constants';
import type {
  JobOutput,
  Mode,
  ProcessingStatus,
  RasterFormat,
  RasterOutputFormat,
  RejectedFile,
} from '../types';

export function usePiktoState() {
  const mode = ref<Mode>('raster');
  const selectedFiles = ref<File[]>([]);
  const rejectedFiles = ref<RejectedFile[]>([]);
  const vectorSettings = ref({ ...DEFAULT_VECTOR_SETTINGS });
  const rasterSettings = ref({
    ...DEFAULT_RASTER_SETTINGS,
    resize: { ...DEFAULT_RASTER_SETTINGS.resize },
  });
  const results = ref<JobOutput[]>([]);
  const status = ref<ProcessingStatus>('idle');
  const hasOutdatedResults = ref(false);
  const sourceImageSize = ref<{ width: number; height: number } | null>(null);

  function markResultsOutdated() {
    if (results.value.length === 0) {
      return;
    }
    hasOutdatedResults.value = true;
    if (status.value === 'done' || status.value === 'partial-success') {
      status.value = 'ready';
    }
  }

  function setMode(value: Mode) {
    mode.value = value;
  }

  function setRasterQuality(value: number) {
    rasterSettings.value.quality = value;
    markResultsOutdated();
  }

  function toggleRasterFormat(value: RasterFormat) {
    const nextFormats = rasterSettings.value.selectedFormats.includes(value)
      ? rasterSettings.value.selectedFormats.filter((format) => format !== value)
      : [...rasterSettings.value.selectedFormats, value];
    rasterSettings.value.selectedFormats = nextFormats;
    markResultsOutdated();
  }

  function setIncludeOriginal(value: boolean) {
    rasterSettings.value.includeOriginal = value;
    markResultsOutdated();
  }

  function setWebpMethod(value: number) {
    rasterSettings.value.webpMethod = value;
    markResultsOutdated();
  }

  function setAvifSpeed(value: number) {
    rasterSettings.value.avifSpeed = value;
    markResultsOutdated();
  }

  function setVectorPrecision(value: number) {
    vectorSettings.value.numberPrecision = value;
    markResultsOutdated();
  }

  function setVectorPrettify(value: boolean) {
    vectorSettings.value.prettifyMarkup = value;
    markResultsOutdated();
  }

  function setVectorRemoveDimensions(value: boolean) {
    vectorSettings.value.removeDimensions = value;
    markResultsOutdated();
  }

  function setResizeWidth(value: number | null) {
    rasterSettings.value.resize.width = value;
    if (
      rasterSettings.value.resize.linked &&
      sourceImageSize.value &&
      value !== null &&
      value > 0
    ) {
      const ratio = sourceImageSize.value.height / sourceImageSize.value.width;
      rasterSettings.value.resize.height = Math.round(value * ratio);
    }
    markResultsOutdated();
  }

  function setResizeHeight(value: number | null) {
    rasterSettings.value.resize.height = value;
    if (
      rasterSettings.value.resize.linked &&
      sourceImageSize.value &&
      value !== null &&
      value > 0
    ) {
      const ratio = sourceImageSize.value.width / sourceImageSize.value.height;
      rasterSettings.value.resize.width = Math.round(value * ratio);
    }
    markResultsOutdated();
  }

  function setResizeLocked(value: boolean) {
    rasterSettings.value.resize.linked = value;
  }

  function setSelectedFiles(files: File[]) {
    selectedFiles.value = files;
  }

  function setRejectedFiles(files: RejectedFile[]) {
    rejectedFiles.value = files;
  }

  function clearFiles() {
    selectedFiles.value = [];
    rejectedFiles.value = [];
  }

  function clearResults() {
    results.value = [];
    hasOutdatedResults.value = false;
  }

  function resetForNewRun() {
    clearResults();
    status.value = selectedFiles.value.length > 0 ? 'ready' : 'idle';
  }

  const outputFormats = computed<RasterOutputFormat[]>(() => {
    const extra = rasterSettings.value.selectedFormats;
    return rasterSettings.value.includeOriginal ? ['original', ...extra] : [...extra];
  });

  const resizeActive = computed(
    () =>
      rasterSettings.value.resize.width !== null &&
      rasterSettings.value.resize.width > 0 &&
      rasterSettings.value.resize.height !== null &&
      rasterSettings.value.resize.height > 0,
  );

  return {
    mode,
    selectedFiles,
    rejectedFiles,
    vectorSettings,
    rasterSettings,
    results,
    status,
    hasOutdatedResults,
    sourceImageSize,
    outputFormats,
    resizeActive,
    setMode,
    setRasterQuality,
    setIncludeOriginal,
    toggleRasterFormat,
    setWebpMethod,
    setAvifSpeed,
    setResizeWidth,
    setResizeHeight,
    setResizeLocked,
    setVectorPrecision,
    setVectorPrettify,
    setVectorRemoveDimensions,
    setSelectedFiles,
    setRejectedFiles,
    clearFiles,
    clearResults,
    resetForNewRun,
  };
}
