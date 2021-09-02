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

Storage.get({ key: 'resource' }).then(r => (state.resource = JSON.parse(r.value)));
Storage.get({ key: 'book' }).then(r => (state.book = JSON.parse(r.value)));
Storage.get({ key: 'chapter' }).then(r => (state.chapter = JSON.parse(r.value)));
Storage.get({ key: 'verse' }).then(r => (state.verse = JSON.parse(r.value)));
Storage.get({ key: 'viewMode' }).then(r => (state.viewMode = JSON.parse(r.value)));

export { state, onChange };
