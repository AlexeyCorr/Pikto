# Pikto

> *«Reducio!»* — оптимизация изображений прямо в браузере.

Pikto сжимает растровые изображения (JPG, PNG, WebP, AVIF) и оптимизирует SVG — полностью локально, без загрузки куда-либо. Файлы не покидают устройство.

**[→ Открыть на alexeycorr.dev/pikto](https://alexeycorr.dev/pikto)**

---

## Что умеет

- **Растровый режим** — сжимает изображения и экспортирует сразу в несколько форматов: оригинал, WebP, AVIF или все три разом. Настройка качества и параметров кодека (усилие WebP, скорость AVIF).
- **Векторный режим** — чистит SVG через SVGO: точность координат, удаление фиксированных размеров, форматирование разметки.
- **Пакетная обработка** — скидываешь файлы, выбираешь настройки, жмёшь *Reducio!*, скачиваешь zip.

## Почему это отличается

**Ноль загрузок.** Обработка идёт в [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Worker_API) через WASM-кодеки [jSquash](https://github.com/nicolo-ribaudo/jSquash) и [SVGO](https://github.com/svg/svgo). Изображения не уходят с машины — никакого сервера, облака и регистрации.

**Не нужно устанавливать.** Это веб-приложение. Открыл, использовал, закрыл.

**Быстро.** WASM-кодеки работают на near-native скорости, воркер не блокирует интерфейс.

## Стек

| Слой | Технология |
|---|---|
| UI | Vue 3 (Composition API) + TypeScript |
| Сборка | Vite |
| Тесты | Vitest + Testing Library |
| Растровые кодеки | jSquash (MozJPEG, WebP, AVIF, OxiPNG) via WASM |
| SVG | SVGO |
| Деплой | Cloudflare Workers + Assets |

## Локальная разработка

```bash
nvm use 24
npm install
npm run dev        # dev-сервер → http://localhost:5173
npm run test       # vitest watch
npm run test:run   # однократный прогон
npm run build      # vue-tsc + vite build
```

## Линтинг

```bash
npm run lint:js    # ESLint
npm run lint:css   # Stylelint
```

## Деплой

Приложение живёт на [alexeycorr.dev/pikto](https://alexeycorr.dev/pikto) — Cloudflare Worker из `worker.ts`, статика из `dist/` через `wrangler.toml`.

```bash
npm run build
npx wrangler deploy
```

---

*Pikto — инструмент без серверной зависимости. Если твои изображения окажутся в интернете — только потому что ты сам их туда положил.*
