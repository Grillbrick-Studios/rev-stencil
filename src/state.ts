import { Storage } from '@capacitor/storage';
import { createStore } from '@stencil/store';
import { Resource, ViewMode } from './models';

export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_FAMILY = 'Arial, Helvetica, sans-serif';

export const SansSerifFonts = ['Arial', '"Arial Narrow"', 'Helvetica', 'Verdana', '"Trebuchet MS"', '"Gill Sans"', '"Noto Sans"', 'Avantgarde', 'Optima'];
export const SerifFonts = ['"Times New Roman", Times', 'Didot', 'Georgia', 'Palatino', 'Bookman', '"New Century Schoolbook"', '"American Typewriter"'];
export const MonospaceFonts = ['"Andale Mono"', '"Courier New"', 'FreeMono', '"OCR A Std"', '"DejaVu Sans Mono"'];
export const CursiveFonts = ['"Comic Sans MS"', '"Apple Chancery"', '"Bradley Hand"', '"Brush Script MT"', '"Snell Roundhand"', '"URW Chancery L"'];
export const FantasyFonts = ['Impact', 'Luminari', 'Chalkduster', '"Jazz LET"', 'Blippo', '"Stencil Std"', '"Marker Felt"', 'Trattatello'];

interface iStore {
  resource?: Resource;
  book?: string;
  chapter?: number;
  verse?: number;
  viewMode: ViewMode;
  showOptions: boolean;
  linkCommentary: boolean;
  fontSize: number;
  fontFamily: string;
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

  root.style.setProperty('--font-family', value);
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
