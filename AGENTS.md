# Pikto — Agent Setup

## Tech stack

- Vue 3 (Composition API, `<script setup>`)
- TypeScript
- Vite + Vitest
- Sass
- Web Worker for image processing
- jSquash codecs (JPEG, WebP, AVIF, PNG via OxiPNG)
- SVGO for SVG optimization

## Local setup

```bash
nvm use 24
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # production build (vue-tsc + vite)
npm run test     # vitest watch
npm run test:run # vitest single run
```

## Project structure

```
src/
  App.vue                        # root shell
  components/                    # UI components
  app/
    types.ts                     # shared types
    constants.ts                 # RASTER_EXTRA_FORMATS, defaults, mime types
    composables/usePiktoState.ts # central state (refs + actions)
    utils/                       # files, download, raster-options
    worker/
      image.worker.ts            # Web Worker entry
      process-raster.ts          # jSquash encoding
      process-svg.ts             # SVGO optimization
      contracts.ts               # WorkerRequest / WorkerResponse types
  styles/
    tokens.css                   # design tokens (CSS custom properties)
    base.css                     # global reset and base styles
```

## Vue conventions

- Block order in SFCs: `<template>` → `<script setup>` → `<style>`
- No `scoped` on `<style>` — use BEM class names for isolation
- All content inside `<script>` and `<style>` blocks is indented with 2 spaces
- Styles live in the component file; no separate CSS modules

## Key design decisions

- **Format logic**: `outputFormats` always includes `'original'` (preserves the source format). Users can add WEBP and/or AVIF as extra outputs via `RASTER_EXTRA_FORMATS`.
- **No server**: all processing runs in-browser via Web Worker.
- **State**: single `usePiktoState` composable used only in `App.vue`; child components receive data via props and emit events upward.
