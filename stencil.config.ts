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
          'build/app.css',
          'build/app.esm.js',
          //'https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=*'
        ],
      },
    },
  ],
};
