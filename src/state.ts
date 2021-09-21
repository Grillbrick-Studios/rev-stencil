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
export const DEFAULT_DARK_MODE = window.matchMedia('(prefers-color-scheme: dark)').matches;

export function isSmall(cb?: (value: boolean) => void): boolean {
  const sizeQuery = window.matchMedia('screen and (max-width: 500px)');
  sizeQuery.addEventListener('change', ev => cb(ev.matches));
  return sizeQuery.matches;
}

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
  forceDarkMode: DEFAULT_DARK_MODE,
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

function abbreviateBook(book: string): string {
  return (
    book
      // old testament
      .replace('Genesis', 'Gen.')
      .replace('Exodus', 'Ex.')
      .replace('Leviticus', 'Lev.')
      .replace('Numbers', 'Num.')
      .replace('Deuteronomy', 'Deut.')
      .replace('Joshua', 'Josh.')
      .replace('Judges', 'Judg.')
      .replace('Samuel', 'Sam.')
      .replace('Chronicles', 'Chron.')
      .replace('Nehemiah', 'Neh.')
      .replace('Esther', 'Est.')
      .replace('Psalms', 'Ps.')
      .replace('Proverbs', 'Prov.')
      .replace('Ecclesiastes', 'Ecc.')
      .replace('Song of Songs', 'Song.')
      .replace('Isaiah', 'Isa.')
      .replace('Jeremiah', 'Jer.')
      .replace('Lamentations', 'Lam.')
      .replace('Ezekel', 'Ezek.')
      .replace('Daniel', 'Dan.')
      .replace('Hosea', 'Hos.')
      .replace('Obadiah', 'Obad.')
      .replace('Jonah', 'Jnh.')
      .replace('Micah', 'Mic')
      .replace('Nahum', 'Nah.')
      .replace('Habakkuk', 'Hab.')
      .replace('Zephaniah', 'Zeph.')
      .replace('Haggai', 'Hag.')
      .replace('Zechariah', 'Zech.')
      .replace('Malachi', 'Mal.')
      // New Testament
      .replace('Matthew', 'Matt.')
      .replace('Romans', 'Rom.')
      .replace('Corinthians', 'Cor.')
      .replace('Galatians', 'Gal.')
      .replace('Ephesians', 'Eph')
      .replace('Philippians', 'Phil.')
      .replace('Colossians', 'Col.')
      .replace('Thessalonians', 'Thes.')
      .replace('Timothy', 'Tim.')
      .replace('Philemon', 'Phm.')
      .replace('Hebrews', 'Heb.')
      .replace('Peter', 'Pet.')
      .replace('John', 'Jn.')
      .replace('Revelation', 'Rev.')
  );
}
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
    state.heading = isSmall() ? abbreviateBook(value) : value;
  }
});

onChange('chapter', v => {
  if (!v) state.verse = undefined;
  else state.heading = `${isSmall() ? abbreviateBook(state.book) : state.book} ${v}`;
});

onChange('verse', v => {
  if (v) state.heading = `${isSmall() ? abbreviateBook(state.book) : state.book} ${state.chapter}:${v}`;
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
  if (value) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
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
    state.forceDarkMode = JSON.parse(r.value) || DEFAULT_DARK_MODE;
  } catch (_) {
    state.forceDarkMode = DEFAULT_DARK_MODE;
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
