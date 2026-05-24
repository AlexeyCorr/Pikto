export interface Translations {
  hero: {
    meta: string;
    lead: string;
  };
  workspace: {
    eyebrow: string;
    title: string;
    modeChangeConfirm: string;
    stepFiles: string;
    stepSettings: string;
    stepRun: string;
  };
  modeSwitch: {
    ariaLabel: string;
    raster: string;
    vector: string;
    video: string;
  };
  runPanel: {
    filesSelected: (n: number) => string;
    outputsPlanned: (n: number) => string;
    outdatedWarning: string;
    compress: string;
    compressing: string;
  };
  settingsPanel: {
    quality: string;
    outputFormats: string;
    original: string;
    advancedCodec: string;
    webpEffort: string;
    webpHint: string;
    avifSpeed: string;
    avifHint: string;
    coordPrecision: string;
    precisionHint: string;
    options: string;
    prettifyMarkup: string;
    prettifyHint: string;
    removeDimensions: string;
    removeDimensionsHint: string;
    resize: string;
    resizeWidth: string;
    resizeHeight: string;
    resizeOriginal: (w: number, h: number) => string;
    resizeSingleFileOnly: string;
    compressionPreset: string;
    presetHigh: string;
    presetBalanced: string;
    presetSmall: string;
    videoFormatComingSoon: string;
  };
  uploadPanel: {
    ariaEmpty: string;
    ariaWithFiles: (n: number) => string;
    dropHere: string;
    dropping: string;
    orText: string;
    clickToChoose: string;
    addMore: string;
    svgOnly: string;
    rasterFormats: string;
    videoFormats: string;
    dropToAdd: string;
    filesSelected: (n: number) => string;
    changeSelection: string;
    filesSelectedSummary: (n: number) => string;
    filesRejectedSummary: (n: number) => string;
    rejectVectorReason: string;
    rejectRasterReason: string;
    rejectVideoReason: string;
    maxSize: (size: string) => string;
    rejectTooLargeReason: (maxSize: string) => string;
    removeFile: string;
  };
  resultsPanel: {
    title: string;
    emptyHint: string;
    outputs: (n: number) => string;
    files: (n: number) => string;
    savedAvg: (p: number) => string;
    largerAvg: (p: number) => string;
    downloadAll: string;
    empty: string;
    error: string;
    processingFailed: string;
    download: string;
  };
}

export type Locale = 'ru' | 'en';
