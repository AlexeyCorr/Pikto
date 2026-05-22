/// <reference lib="webworker" />

import { encodeRasterFile, getRasterOutputFormat } from './process-raster';
import { optimizeSvgText } from './process-svg';
import type { WorkerRequest, WorkerResponse } from './contracts';
import type { JobOutput } from '../types';

const ctx: DedicatedWorkerGlobalScope = self as DedicatedWorkerGlobalScope;

ctx.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  try {
    if (event.data.type === 'process-vector-batch') {
      const total = event.data.jobs.length;
      const results: JobOutput[] = [];

      for (const [index, job] of event.data.jobs.entries()) {
        const source = await job.file.text();
        const output = await optimizeSvgText(source, job.settings);
        const blob = new Blob([output], { type: 'image/svg+xml' });

        results.push({
          id: job.id,
          sourceFileName: job.file.name,
          sourceFormat: 'svg',
          targetFormat: 'svg',
          originalBytes: job.file.size,
          outputBytes: blob.size,
          savedPercent: 0,
          blob,
          status: 'success',
        });

        const progress: WorkerResponse = { type: 'progress', completed: index + 1, total };
        ctx.postMessage(progress);
      }

      ctx.postMessage({ type: 'done', results } satisfies WorkerResponse);
      return;
    }

    if (event.data.type === 'process-raster-batch') {
      const total = event.data.jobs.reduce((sum, job) => sum + job.targetFormats.length, 0);
      const results: JobOutput[] = [];
      let completed = 0;

      for (const job of event.data.jobs) {
        for (const targetFormat of job.targetFormats) {
          const effectiveFormat = getRasterOutputFormat(job.file, targetFormat);

          try {
            const blob = await encodeRasterFile(job.file, targetFormat, job.settings);

            results.push({
              id: `${job.id}-${effectiveFormat}`,
              sourceFileName: job.file.name,
              sourceFormat: job.file.type.replace('image/', ''),
              targetFormat: effectiveFormat,
              originalBytes: job.file.size,
              outputBytes: blob.size,
              savedPercent: 0,
              blob,
              status: 'success',
            });
          } catch (error) {
            results.push({
              id: `${job.id}-${effectiveFormat}`,
              sourceFileName: job.file.name,
              sourceFormat: job.file.type.replace('image/', ''),
              targetFormat: effectiveFormat,
              originalBytes: job.file.size,
              outputBytes: 0,
              savedPercent: 0,
              status: 'error',
              errorMessage: error instanceof Error ? error.message : 'Unknown raster error',
            });
          }

          completed += 1;
          ctx.postMessage({ type: 'progress', completed, total } satisfies WorkerResponse);
        }
      }

      ctx.postMessage({ type: 'done', results } satisfies WorkerResponse);
    }
  } catch (error) {
    ctx.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown worker error',
    } satisfies WorkerResponse);
  }
};
