import { Storage } from '@capacitor/storage';
import { createStore } from '@stencil/store';
import { Resource, ViewMode } from './models';

interface iStore {
  resource?: Resource;
  book?: string;
  chapter?: number;
  verse?: number;
  viewMode: ViewMode;
}

const store = createStore<iStore>({
  viewMode: ViewMode.Paragraph,
});
const { state, onChange } = store;

store.on('set', (key, value) => {
  value = JSON.stringify(value);
  Storage.set({
    key,
    value,
  });
});

onChange('resource', value => {
  if (!value) state.book = undefined;
});

onChange('book', value => {
  if (!value) state.chapter = undefined;
});

onChange('chapter', v => {
  if (!v) state.verse = undefined;
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
    state.viewMode = JSON.parse(r.value);
    if (!state.viewMode) state.viewMode = ViewMode.Paragraph;
  } catch (_) {
    state.viewMode = ViewMode.Paragraph;
  }
});

export { state, onChange };
