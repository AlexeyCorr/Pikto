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
  const rasterSettings = ref({ ...DEFAULT_RASTER_SETTINGS });
  const results = ref<JobOutput[]>([]);
  const status = ref<ProcessingStatus>('idle');
  const hasOutdatedResults = ref(false);

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

  return {
    mode,
    selectedFiles,
    rejectedFiles,
    vectorSettings,
    rasterSettings,
    results,
    status,
    hasOutdatedResults,
    outputFormats,
    setMode,
    setRasterQuality,
    setIncludeOriginal,
    toggleRasterFormat,
    setWebpMethod,
    setAvifSpeed,
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
