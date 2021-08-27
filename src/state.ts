import { createStore } from '@stencil/store';
import { Resource } from './models/interfaces';

interface iStore {
  resource?: Resource;
  book?: string;
  chapter?: number;
}
export const { state, onChange } = createStore<iStore>({});
