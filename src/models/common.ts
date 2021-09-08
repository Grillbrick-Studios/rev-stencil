export interface iData<T> {
  data: T[];
}

export interface iSerializeData<T> {
  data: T[];
  updated: Date;
}

export enum Resource {
  Bible = 'Bible',
  Appendix = 'Appendix',
  Commentary = 'Commentary',
}

export class Asynclock {
  disable = () => {};
  promise = Promise.resolve();

  enable() {
    this.promise = new Promise(resolve => (this.disable = resolve));
  }
}

export interface BiblePath {
  book: string;
  chapter: number;
  verse?: number;
  resource?: Resource;
}
