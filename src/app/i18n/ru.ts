import type { Translations } from './types';

function pluralRu(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const rem = abs % 10;
  if (abs >= 11 && abs <= 19) return many;
  if (rem === 1) return one;
  if (rem >= 2 && rem <= 4) return few;
  return many;
}

export const ru: Translations = {
  hero: {
    meta: 'инструмент = "оптимизация медиафайлов"',
    lead: 'Прямо в браузере — без загрузки на сервер',
  },
  workspace: {
    eyebrow: 'Рабочее пространство',
    title: 'Оптимизация файлов',
    modeChangeConfirm: 'Смена режима очистит текущую подборку файлов. Продолжить?',
    stepFiles: 'Файлы',
    stepSettings: 'Настройки',
    stepRun: 'Запуск',
  },
  modeSwitch: {
    ariaLabel: 'Режим сжатия',
    raster: 'Растр',
    vector: 'Вектор',
    video: 'Видео',
  },
  runPanel: {
    filesSelected: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} выбрано`,
    outputsPlanned: (n) => `${n} ${pluralRu(n, 'результат', 'результата', 'результатов')} будет создано`,
    outdatedWarning: 'Настройки изменились после прошлого запуска. Обновите результаты.',
    compress: 'Reducio!',
    compressing: 'Reducio...',
  },
  settingsPanel: {
    quality: 'Качество',
    outputFormats: 'Форматы вывода',
    original: 'Оригинал',
    advancedCodec: 'Расширенные настройки кодека',
    webpEffort: 'Усилие WebP',
    webpHint: 'Больше усилий → меньше файл, медленнее кодирование',
    avifEffort: 'Усилие AVIF',
    avifHint: 'Больше усилий → меньше файл, медленнее кодирование',
    coordPrecision: 'Точность координат',
    precisionHint: 'Знаков после запятой в координатах пути — меньше = меньше файл, ниже точность',
    options: 'Параметры',
    prettifyMarkup: 'Форматировать разметку',
    prettifyHint: 'Отступы и форматирование выходного SVG',
    removeDimensions: 'Убрать фиксированные размеры',
    removeDimensionsHint: 'Удалить width/height, вывести viewBox из них если отсутствует',
    resize: 'Размер',
    resizeWidth: 'Ш',
    resizeHeight: 'В',
    resizeOriginal: (w, h) => `Оригинал: ${w} × ${h}`,
    resizeSingleFileOnly: 'Доступно только для одного файла',
    compressionPreset: 'Пресет сжатия',
    presetHigh: 'Высокое качество',
    presetBalanced: 'Баланс',
    presetSmall: 'Макс. сжатие',
    videoFormatComingSoon: 'скоро',
  },
  uploadPanel: {
    ariaEmpty: 'Перетащите файлы или нажмите для выбора',
    ariaWithFiles: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} выбрано. Нажмите или перетащите для добавления.`,
    dropHere: 'Перетащите файлы сюда',
    dropping: 'Отпустите для добавления',
    orText: 'или',
    clickToChoose: 'выберите вручную',
    addMore: 'Добавить ещё',
    svgOnly: 'Только SVG',
    rasterFormats: 'JPG, PNG, WebP, AVIF',
    videoFormats: 'MP4, AVI',
    dropToAdd: 'Отпустите для добавления',
    filesSelected: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')}`,
    changeSelection: 'Изменить выбор',
    filesSelectedSummary: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} выбрано`,
    filesRejectedSummary: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} отклонено`,
    rejectVectorReason: 'Векторный режим принимает только SVG-файлы.',
    rejectRasterReason: 'Растровый режим принимает JPG, PNG, WebP и AVIF.',
    rejectVideoReason: 'Режим видео принимает только MP4 и AVI.',
    maxSize: (size) => `до ${size}`,
    rejectTooLargeReason: (maxSize) => `Файл слишком большой. Максимальный размер: ${maxSize}.`,
    removeFile: 'Убрать файл',
  },
  resultsPanel: {
    title: 'Результаты',
    emptyHint: 'Проверьте каждый оптимизированный файл перед загрузкой.',
    outputs: (n) => `${n} ${pluralRu(n, 'результат', 'результата', 'результатов')}`,
    files: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')}`,
    savedAvg: (p) => `−${p}% в среднем`,
    largerAvg: (p) => `+${p}% в среднем`,
    downloadAll: 'Скачать всё',
    empty: 'Пока нет обработанных файлов. Запустите Reducio!, чтобы они появились здесь.',
    error: 'Ошибка',
    processingFailed: 'Ошибка обработки',
    download: 'Скачать',
  },
};
