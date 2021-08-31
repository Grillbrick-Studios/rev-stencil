import { iData, iSerializeData, Asynclock } from './common';
import { iVerse, Verse } from './verse';
import { writeFile, readFile } from './filesystem';

export const URL = 'https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=bible';

export interface iBibleJson {
  // eslint-disable-next-line camelcase
  REV_Bible: iVerse[];
  updated?: Date;
}

export class Bible implements iData<iVerse>, iSerializeData<iVerse> {
  private static verses: Verse[];
  private static updated: Date;
  private static lock: Asynclock = new Asynclock();

  public static get data(): iVerse[] {
    return Bible.verses.map(v => v.unwrap());
  }

  public get updated(): Date {
    return Bible.updated;
  }

  public static async save() {
    const data: iSerializeData<iVerse> = {
      data: Bible.data,
      updated: Bible.updated,
    };

    console.log('saving bible...');
    await writeFile(data, 'Bible');
    console.log('bible saved!');
  }

  public static async load(): Promise<boolean> {
    try {
      console.log('attempting to load bible from disk');
      const bibleData: iSerializeData<iVerse> = await readFile('Bible');
      Bible.verses = bibleData.data.map(v => new Verse(v));
      Bible.updated = new Date(bibleData.updated);
      console.log('Bible loaded from disk!');
      return true;
    } catch (e) {
      console.log(`Error loading bible from disk: ${e}`);
      return false;
    }
  }

  public static set data(verses: iVerse[]) {
    Bible.verses = verses.map(v => new Verse(v));
  }

  public get data(): iVerse[] {
    return Bible.verses;
  }

  constructor(verses: iVerse[]) {
    Bible.verses = verses.map(v => new Verse(v));
  }

  private static async fetch() {
    console.log('Fetching bible from web. Please wait...');

    const bible: iBibleJson = await fetch(URL).then(res => res.json());
    Bible.verses = bible.REV_Bible.map(v => new Verse(v));
    Bible.updated = new Date();
    Bible.save();
    console.log('Bible downloaded!');
  }

  static async onReady(): Promise<Bible> {
    await this.lock.promise;
    this.lock.enable();
    try {
      if (Bible.verses) return new Bible(Bible.verses);
      else if (await Bible.load()) return new Bible(Bible.verses);
      else await Bible.fetch();
    } catch (e) {
      console.error(e);
    } finally {
      this.lock.disable();
    }
    return new Bible(Bible.data);
  }

  getFunnyVerses(): string[] {
    const funnyVerses = Bible.verses.map(v => v.html()).filter(v => v.indexOf('[') >= 0 || v.indexOf(']') >= 0);
    // .map(v => v.slice(v.indexOf("["), v.indexOf("]")));
    return funnyVerses;
  }

  getBooks(filter: string = ''): string[] {
    const booksArray = Bible.verses.map(v => v.book).filter(b => b.startsWith(filter));
    const bookSet = new Set(booksArray);
    //return new Array(...bookSet.keys());
    return Array.from(bookSet);
  }

  getChapters(book: string): number[] {
    const chaptersArray = Bible.verses.filter(v => v.book === book).map(v => v.chapter);
    const chapterSet = new Set(chaptersArray);
    return Array.from(chapterSet);
  }

  numChapters(book: string): number {
    return this.getChapters(book).length;
  }

  getVerses(book: string, chapter: number, verse?: number): Verse[] {
    if (verse) return Bible.verses.filter(v => v.book === book && v.chapter === chapter && v.verse === verse);
    return Bible.verses.filter(v => v.book === book && v.chapter === chapter);
  }

  getVerseNumbers(book: string, chapter: number): number[] {
    return this.getVerses(book, chapter).map(v => v.verse);
  }

  numVerses(book: string, chapter: number): number {
    return this.getVerses(book, chapter).length;
  }
}
