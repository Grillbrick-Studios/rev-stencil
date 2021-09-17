import { Storage } from '@capacitor/storage';
import { createStore } from '@stencil/store';
import { Font, Resource, ViewMode } from './models';

export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_FAMILY: Font = {
  value: 'Arial, Helvetica, sans-serif',
  label: 'Arial (default)',
};

export const Fonts: Font[] = [
  {
    heading: 'Sans Serif Fonts',
    headingStyle: 'sans-serif',
    value: 'Arial, sans-serif',
    label: 'Arial',
  },
  {
    value: '"Arial Narrow", sans-serif',
    label: 'Arial Narrow',
  },
  {
    value: 'Helvetica, sans-serif',
    label: 'Helvetica',
  },
  {
    value: 'Verdana, sans-serif',
    label: 'Verdana',
  },
  {
    value: '"Trebuchet MS", sans-serif',
    label: 'Trebuchet MS',
  },
  {
    value: '"Gill Sans", sans-serif',
    label: 'Gill Sans',
  },
  {
    value: '"Noto Sans", sans-serif',
    label: 'Noto Sans',
  },
  {
    value: 'Avantgarde, "TeX Gyre Adventor", "URW Gothic L", sans-serif',
    label: 'Avantgarde',
  },
  {
    value: 'Optima, sans-serif',
    label: 'Optima',
  },
  {
    heading: 'Serif Fonts',
    headingStyle: 'serif',
    value: 'Times, "Times New Roman", serif',
    label: 'Times New Roman',
  },
  {
    value: 'Didot, serif',
    label: 'Didot',
  },
  {
    value: 'Georgia, serif',
    label: 'Georgia',
  },
  {
    value: 'Palatino, "URW Palladio L", serif',
    label: 'Palatino',
  },
  {
    value: 'Bookman, "URW Bookman L", serif',
    label: 'Bookman',
  },
  {
    value: '"New Century Schoolbook", "TeX Gyre Schola", serif',
    label: 'New Century Schoolbook',
  },
  {
    value: '"American Typewriter", serif',
    label: 'American Typewriter',
  },
  {
    heading: 'Monospaced Fonts',
    headingStyle: 'monospace',
    value: '"Andale Mono", monospace',
    label: 'Andale Mono',
  },
  {
    value: 'Courier, monospace',
    label: 'Courier',
  },
  {
    value: '"Courier New", monospace',
    label: 'Courier New',
  },
  {
    value: 'FreeMono, monospace',
    label: 'FreeMono',
  },
  {
    value: '"OCR A Std", monospace',
    label: 'OCR A Std',
  },
  {
    value: '"DejaVu Sans Mono", monospace',
    label: 'DejaVu Sans Mono',
  },
  {
    heading: 'Cursive Fonts',
    headingStyle: 'cursive',
    value: '"Comic Sans MS", "Comic Sans", cursive',
    label: 'Comic Sans',
  },
  {
    value: '"Apple Chancery", cursive',
    label: 'Apple Chancery',
  },
  {
    value: '"Bradley Hand", cursive',
    label: 'Bradley Hand',
  },
  {
    value: '"Brush Script MT", "Brush Script Std", cursive',
    label: 'Brush Script',
  },
  {
    value: '"Snell Roundhand", cursive',
    label: 'Snell Roundhand',
  },
  {
    value: '"URW Chancery L", cursive',
    label: 'URW Chancery',
  },
  {
    heading: 'Fantasy Fonts',
    headingStyle: 'fantasy',
    value: 'Impact, fantasy',
    label: 'Impact',
  },
  {
    value: 'Luminari, fantasy',
    label: 'Luminari',
  },
  {
    value: 'Chalkduster, fantasy',
    label: 'Chalkduster',
  },
  {
    value: '"Jazz LET", fantasy',
    label: 'Jazz LET',
  },
  {
    value: 'Blippo, fantasy',
    label: 'Blippo',
  },
  {
    value: '"Stencil Std", fantasy',
    label: 'Stencil Std',
  },
  {
    value: '"Marker Felt", fantasy',
    label: 'Marker Felt',
  },
  {
    value: 'Trattatello, fantasy',
    label: 'Trattatello',
  },
];

interface iStore {
  resource?: Resource;
  book?: string;
  chapter?: number;
  verse?: number;
  viewMode: ViewMode;
  showOptions: boolean;
  linkCommentary: boolean;
  fontSize: number;
  fontFamily: Font;
}

const store = createStore<iStore>({
  viewMode: ViewMode.Paragraph,
  showOptions: false,
  linkCommentary: true,
  fontSize: DEFAULT_FONT_SIZE,
  fontFamily: DEFAULT_FONT_FAMILY,
});

const { state, onChange } = store;

/*
 * Here I save all of the state to storage for future reference.
 */
store.on('set', (key, value) => {
  value = JSON.stringify(value);
  Storage.set({
    key,
    value,
  });
});

/*
 * Here is where I make sure that the current path makes sense.
 */
onChange('resource', value => {
  if (!value) state.book = undefined;
});

onChange('book', value => {
  if (!value) state.chapter = undefined;
});

onChange('chapter', v => {
  if (!v) state.verse = undefined;
});

/*
 * Here I set the font variable when the state changes
 */
onChange('fontSize', value => {
  const root = document.documentElement;

  root.style.setProperty('--font-size', `${value}px`);
});

onChange('fontFamily', value => {
  const root = document.documentElement;

  root.style.setProperty('--font-family', value.value);
});

/*
 * Here I load everything from storage. Check for null and use default values.
 */
Storage.get({ key: 'fontFamily' }).then(r => {
  try {
    state.fontFamily = JSON.parse(r.value) || DEFAULT_FONT_FAMILY;
  } catch (_) {
    state.fontFamily = DEFAULT_FONT_FAMILY;
  }
});
Storage.get({ key: 'fontSize' }).then(r => {
  try {
    state.fontSize = JSON.parse(r.value) || DEFAULT_FONT_SIZE;
  } catch (_) {
    state.fontSize = DEFAULT_FONT_SIZE;
  }
});
Storage.get({ key: 'resource' }).then(r => {
  try {
    state.resource = JSON.parse(r.value);
  } catch (_) {
    state.resource = undefined;
  }
});
Storage.get({ key: 'book' }).then(r => {
  try {
    state.book = JSON.parse(r.value);
  } catch (_) {
    state.book = undefined;
  }
});
Storage.get({ key: 'chapter' }).then(r => {
  try {
    state.chapter = JSON.parse(r.value);
  } catch (_) {
    state.chapter = undefined;
  }
});
Storage.get({ key: 'verse' }).then(r => {
  try {
    state.verse = JSON.parse(r.value);
  } catch (_) {
    state.verse = undefined;
  }
});
Storage.get({ key: 'viewMode' }).then(r => {
  try {
    state.viewMode = JSON.parse(r.value) || ViewMode.Paragraph;
  } catch (_) {
    state.viewMode = ViewMode.Paragraph;
  }
});
Storage.get({ key: 'linkCommentary' }).then(r => {
  try {
    state.linkCommentary = JSON.parse(r.value);
    if (state.linkCommentary === undefined || state.linkCommentary === null) state.linkCommentary = true;
  } catch (_) {
    state.linkCommentary = true;
  }
});

export { state, onChange };
