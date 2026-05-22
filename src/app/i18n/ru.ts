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
    meta: 'инструмент = "пакетная оптимизация изображений" // v1.21',
    lead: 'Подготовьте веб-ресурсы прямо в браузере — векторные и растровые файлы, пакетное сжатие.',
  },
  workspace: {
    eyebrow: 'Рабочее пространство',
    title: 'Выберите режим и сожмите файлы пакетом',
    modeChangeConfirm: 'Смена режима очистит текущую подборку файлов. Продолжить?',
  },
  modeSwitch: {
    ariaLabel: 'Режим сжатия',
    raster: 'Растр',
    vector: 'Вектор',
  },
  runPanel: {
    filesSelected: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} выбрано`,
    outputsPlanned: (n) => `${n} ${pluralRu(n, 'выходной файл', 'выходных файла', 'выходных файлов')} запланировано`,
    outdatedWarning: 'Настройки изменились после последнего запуска. Результаты устарели.',
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
    avifSpeed: 'Скорость AVIF',
    avifHint: 'Меньше скорость → меньше файл, медленнее кодирование',
    coordPrecision: 'Точность координат',
    precisionHint: 'Знаков после запятой в координатах пути — меньше = меньше файл, ниже точность',
    options: 'Параметры',
    prettifyMarkup: 'Форматировать разметку',
    prettifyHint: 'Отступы и форматирование выходного SVG',
    removeDimensions: 'Убрать фиксированные размеры',
    removeDimensionsHint: 'Удалить width/height, вывести viewBox из них если отсутствует',
  },
  uploadPanel: {
    ariaEmpty: 'Перетащите файлы или нажмите для выбора',
    ariaWithFiles: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} выбрано. Нажмите или перетащите для замены.`,
    dropHere: 'Перетащите файлы сюда',
    dropping: 'Отпустите для добавления',
    orText: 'или',
    clickToChoose: 'выберите вручную',
    svgOnly: 'Только SVG',
    rasterFormats: 'JPG, PNG, WebP, AVIF',
    dropToReplace: 'Отпустите для замены',
    filesSelected: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} выбрано`,
    changeSelection: 'Изменить выбор',
    filesSelectedSummary: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} выбрано`,
    filesRejectedSummary: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')} отклонено`,
    rejectVectorReason: 'Векторный режим принимает только SVG-файлы.',
    rejectRasterReason: 'Растровый режим принимает JPG, PNG, WebP и AVIF.',
  },
  resultsPanel: {
    title: 'Результаты',
    emptyHint: 'Проверьте каждый оптимизированный ресурс перед загрузкой.',
    outputs: (n) => `${n} ${pluralRu(n, 'результат', 'результата', 'результатов')}`,
    files: (n) => `${n} ${pluralRu(n, 'файл', 'файла', 'файлов')}`,
    savedAvg: (p) => `−${p}% в среднем`,
    largerAvg: (p) => `+${p}% в среднем`,
    downloadAll: 'Скачать всё',
    empty: 'Нет обработанных файлов. Запустите пакетное сжатие, молодой падаван.',
    error: 'Ошибка',
    processingFailed: 'Ошибка обработки',
    download: 'Скачать',
  },
};
