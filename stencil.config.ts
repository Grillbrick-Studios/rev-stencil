import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: {
        globPatterns: [
          // The basics to cache everything?
          '**/*.{js,css,json,html,ico,png}',
          'build/svg/{arrow-back-outline,home-outline,close-circle}.svg',
        ],
      },
    },
  ],
};
