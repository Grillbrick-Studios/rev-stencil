import { Storage } from '@capacitor/storage';
import { createStore } from '@stencil/store';
import { Font, Resource, ViewMode } from './models';

export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_FAMILY: Font = {
  value: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  label: 'Arial (default)',
};

export const Fonts: Font[] = [
  {
    heading: 'Sans Serif Fonts',
    headingStyle: 'sans-serif',
    value: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    label: 'Arial',
  },
  {
    value: '"Arial Black", "Arial Bold", Gadget, sans-serif',
    label: 'Arial Black',
  },
  {
    value: '"Arial Narrow", Arial, sans-serif',
    label: 'Arial Narrow',
  },
  {
    value: 'Impact, Haettenschweiler, "Franklin Gothic Bold", Charcoal, "Helvetica Inserat", "Bitstream Vera Sans Bold", "Arial Black", sans serif',
    label: 'Impact',
  },
  {
    value: 'Verdana, Geneva, sans-serif',
    label: 'Verdana',
  },
  {
    value: 'Tahoma, Verdana, Segoe, sans-serif',
    label: 'Tahoma',
  },
  {
    value: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',
    label: 'Trebuchet',
  },
  {
    heading: 'Serif Fonts',
    headingStyle: 'serif',
    value: 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif',
    label: 'Times New Roman',
  },
  {
    value: 'Didot, "Didot LT STD", "Hoefler Text", Garamond, "Times New Roman", serif',
    label: 'Didot',
  },
  {
    value: 'Georgia, Times, "Times New Roman", serif',
    label: 'Georgia',
  },
  {
    value: '"American Typewriter", "Lucida Sans Typewriter", serif',
    label: 'American Typewriter',
  },
  {
    heading: 'Monospaced Fonts',
    headingStyle: 'monospace',
    value: '"Andale Mono", AndaleMono, monospace',
    label: 'Andalé Mono',
  },
  {
    value: '"Lucida Sans Typewriter", "Lucida Console", monaco, "Bitstream Vera Sans Mono", monospace',
    label: 'Lucida Sans Typewriter',
  },
  {
    value: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
    label: 'Courier New',
  },
  {
    value: '"Lucinda Console", "Lucida Sans Typewriter", monaco, "Bitstream Vera Sans Mono", monospace',
    label: 'Lucinda Console',
  },
  {
    value: 'monaco, Consolas, "Lucida Console", monospace',
    label: 'Monaco',
  },
  {
    value: 'Consolas, monaco, monospace',
    label: 'Consolas',
  },
  {
    heading: 'Cursive Fonts',
    headingStyle: 'cursive',
    value: '"Comic Sans MS", "Comic Sans", cursive',
    label: 'Comic Sans',
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
    heading: 'Fantasy Fonts',
    headingStyle: 'fantasy',
    value: 'Luminari, fantasy',
    label: 'Luminari',
  },
  {
    value: 'Copperplate, "Copperplate Gothic Light", fantasy',
    label: 'Copperplate',
  },
  {
    value: 'Papyrus, fantasy',
    label: 'Papyrus',
  },
  {
    value: 'Chalkduster, fantasy',
    label: 'Chalkduster',
  },
  {
    value: 'Blippo, fantasy',
    label: 'Blippo',
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
