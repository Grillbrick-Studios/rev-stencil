import { iData, Asynclock, iSerializeData, BiblePath, DaysSince } from './common';
import { writeFile, readFile } from './filesystem';

const URL = 'https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary';

export interface iCommentary {
  book: string;
  chapter: number;
  verse: number;
  commentary: string;
}

export interface iStringCommentary {
  book: string;
  chapter: string;
  verse: string;
  commentary: string;
}

interface iCommentaryJson {
  REV_Commentary: iStringCommentary[];
  updated?: Date;
}

export class Commentary implements iData<iCommentary> {
  private static _data: iCommentary[];
  private static updated: Date;
  private static lock = new Asynclock();

  private static async save() {
    const data: iSerializeData<iCommentary> = {
      data: Commentary._data,
      updated: Commentary.updated,
    };

    await writeFile(data, 'Commentary');
  }

  private static async load(): Promise<boolean> {
    try {
      const commentaryData: iSerializeData<iStringCommentary> = await readFile('Commentary');
      Commentary._data = commentaryData.data.map(c => ({
        ...c,
        chapter: parseInt(c.chapter),
        verse: parseInt(c.verse),
      }));
      Commentary.updated = new Date(commentaryData.updated);
      if (DaysSince(Commentary.updated) > 7) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  constructor(data: iCommentary[]) {
    Commentary._data = data;
  }

  public get data(): iCommentary[] {
    return Commentary._data;
  }

  private static async fetch() {
    console.log('Fetching commentary from web please wait...');
    const res = await fetch(URL);
    console.log('Commentary downloaded!');
    const commentary: iCommentaryJson = await res.json();
    Commentary._data = commentary.REV_Commentary.map(c => ({
      ...c,
      chapter: parseInt(c.chapter),
      verse: parseInt(c.verse),
    }));
    Commentary.updated = new Date();
    Commentary.save();
  }

  static async onReady(): Promise<Commentary> {
    await this.lock.promise;
    this.lock.enable();
    try {
      if (Commentary._data) return new Commentary(Commentary._data);
      else if (await Commentary.load()) return new Commentary(Commentary._data);
      else await Commentary.fetch();
    } catch (e) {
      console.error(e);
    } finally {
      this.lock.disable();
    }
    return new Commentary(Commentary._data);
  }

  getBooks(): string[] {
    const booksArray = Commentary._data.map(v => v.book);
    const bookSet = new Set(booksArray);
    return Array.from(bookSet);
  }

  getChapters(book: string): number[] {
    const chapterArray = Commentary._data.filter(v => v.book === book).map(v => v.chapter);
    const chapterSet = new Set(chapterArray);
    return Array.from(chapterSet);
  }

  getVerses(book: string, chapter: number): number[] {
    const verseArray = Commentary._data.filter(v => v.book === book && v.chapter === chapter).map(v => v.verse);
    const verseSet = new Set(verseArray);
    return Array.from(verseSet);
  }

  getCommentary(book: string, chapter: number, verse: number): string[] {
    const verseArray = Commentary._data.filter(v => v.book === book && v.chapter === chapter && v.verse === verse).map(v => v.commentary);
    return verseArray;
  }

  private hasNextVerse(path: BiblePath): boolean {
    const { book, chapter, verse } = path;
    const verses = this.getVerses(book, chapter);
    const index = verses.indexOf(verse);
    if (index === -1) return false;
    return verses.length > index + 1;
  }

  private getNextVerse(path: BiblePath): BiblePath {
    const { book, chapter, verse } = path;
    const verses = this.getVerses(book, chapter);
    const index = verses.indexOf(verse);
    return {
      ...path,
      verse: verses[index + 1],
    };
  }

  private hasPrevVerse(path: BiblePath): boolean {
    const { book, chapter, verse } = path;
    const verses = this.getVerses(book, chapter);
    const index = verses.indexOf(verse);
    if (index === -1) return false;
    return index > 0;
  }

  private getPrevVerse(path: BiblePath): BiblePath {
    const { book, chapter, verse } = path;
    const verses = this.getVerses(book, chapter);
    const index = verses.indexOf(verse);
    return {
      ...path,
      verse: verses[index - 1],
    };
  }

  private hasNextChapter(path: BiblePath): boolean {
    const { book, chapter } = path;
    const chapters = this.getChapters(book);
    const index = chapters.indexOf(chapter);
    if (index === -1) return false;
    return chapters.length > index + 1;
  }

  private getNextChapter(path: BiblePath): BiblePath {
    const { book, chapter } = path;
    const chapters = this.getChapters(book);
    const verses = this.getVerses(book, chapter + 1);
    const index = chapters.indexOf(chapter);
    return {
      ...path,
      chapter: chapters[index + 1],
      verse: verses[0],
    };
  }

  private hasPrevChapter(path: BiblePath): boolean {
    const { book, chapter } = path;
    const chapters = this.getChapters(book);
    const index = chapters.indexOf(chapter);
    if (index === -1) return false;
    return index > 0;
  }

  private getPrevChapter(path: BiblePath): BiblePath {
    const { book, chapter } = path;
    const chapters = this.getChapters(book);
    const verses = this.getVerses(book, chapter - 1);
    const index = chapters.indexOf(chapter);
    return {
      ...path,
      chapter: chapters[index - 1],
      verse: verses[verses.length - 1],
    };
  }

  private hasNextBook(path: BiblePath): boolean {
    const { book } = path;
    const books = this.getBooks();
    const index = books.indexOf(book);
    if (index === -1) return false;
    return books.length > index + 1;
  }

  private getNextBook(path: BiblePath): BiblePath {
    let { book, chapter, verse } = path;
    const books = this.getBooks();
    const index = books.indexOf(book);
    book = books[index + 1];
    const chapters = this.getChapters(book);
    chapter = chapters[0];
    const verses = this.getVerses(book, chapter);
    verse = verses[0];
    return {
      book,
      chapter,
      verse,
    };
  }

  private hasPrevBook(path: BiblePath): boolean {
    const { book } = path;
    const books = this.getBooks();
    const index = books.indexOf(book);
    if (index === -1) return false;
    return index > 0;
  }

  private getPrevBook(path: BiblePath): BiblePath {
    let { book, chapter, verse } = path;
    const books = this.getBooks();
    const index = books.indexOf(book);
    book = books[index - 1];
    const chapters = this.getChapters(book);
    chapter = chapters[chapters.length - 1];
    const verses = this.getVerses(book, chapter);
    verse = verses[verses.length - 1];
    return {
      book,
      chapter,
      verse,
    };
  }

  public next(path: BiblePath): BiblePath {
    if (this.hasNextVerse(path)) return this.getNextVerse(path);
    if (this.hasNextChapter(path)) return this.getNextChapter(path);
    if (this.hasNextBook(path)) return this.getNextBook(path);
    return path;
  }

  public prev(path: BiblePath): BiblePath {
    if (this.hasPrevVerse(path)) return this.getPrevVerse(path);
    if (this.hasPrevChapter(path)) return this.getPrevChapter(path);
    if (this.hasPrevBook(path)) return this.getPrevBook(path);
    return path;
  }
}
