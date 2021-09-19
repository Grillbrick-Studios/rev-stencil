import { Storage } from '@capacitor/storage';
import { createStore } from '@stencil/store';
import { Font, Resource, ViewMode } from './models';
import { Fonts } from './fonts';
import { scrollTop } from './helpers/utils';

export { Fonts };
export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_FAMILY: Font = {
  value: 'Merriweather, "Times New Roman", serif',
  label: 'Merriweather (default)',
};

interface iStore {
  resource?: Resource;
  book?: string;
  chapter?: number;
  verse?: number;
  heading?: string;
  forceDarkMode: boolean;
  viewMode: ViewMode;
  showOptions: boolean;
  linkCommentary: boolean;
  fontSize: number;
  fontFamily: Font;
  numColumns: number;
}

const store = createStore<iStore>({
  viewMode: ViewMode.Paragraph,
  showOptions: false,
  linkCommentary: true,
  fontSize: DEFAULT_FONT_SIZE,
  fontFamily: DEFAULT_FONT_FAMILY,
  forceDarkMode: false,
  numColumns: 1,
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
onChange('showOptions', _ => {
  scrollTop();
});

onChange('resource', value => {
  if (!value) {
    state.heading = undefined;
    state.book = undefined;
  }
});

onChange('book', value => {
  if (!value) {
    state.heading = undefined;
    state.chapter = undefined;
  } else {
    state.heading = value;
  }
});

onChange('chapter', v => {
  if (!v) state.verse = undefined;
  else state.heading = `${state.book} ${v}`;
});

onChange('verse', v => {
  if (v) state.heading = `${state.book} ${state.chapter}:${v}`;
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
 * Here I update darkmode
 */
onChange('forceDarkMode', value => {
  document.body.classList.toggle('dark', value);
});

/*
 * Here I load everything from storage. Check for null and use default values.
 */
Storage.get({ key: 'numColumns' }).then(r => {
  try {
    state.numColumns = JSON.parse(r.value) || 1;
  } catch (_) {
    state.numColumns = 1;
  }
});
Storage.get({ key: 'forceDarkMode' }).then(r => {
  try {
    state.forceDarkMode = JSON.parse(r.value) || false;
  } catch (_) {
    state.forceDarkMode = false;
  }
});
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
