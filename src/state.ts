import { createStore } from '@stencil/store';
import { Resource } from './models';

interface iStore {
  resource?: Resource;
  book?: string;
  chapter?: number;
  verse?: number;
}

const { state, onChange } = createStore<iStore>({});

onChange('resource', value => {
  if (!value) state.book = undefined;
});

onChange('book', value => {
  if (!value) state.chapter = undefined;
});

onChange('chapter', v => {
  if (!v) state.verse = undefined;
});

export { state, onChange };
