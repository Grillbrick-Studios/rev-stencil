import '@ionic/core';
import { setupConfig } from '@ionic/core';
import { toggleDarkTheme } from '../helpers/utils';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

toggleDarkTheme(prefersDark.matches);

// Listen for changes to the prefers-color-scheme media query
prefersDark.addListener(mediaQuery => toggleDarkTheme(mediaQuery.matches));

export default () => {
  setupConfig({
    mode: 'md',
  });
};
