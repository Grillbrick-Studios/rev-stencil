import { BiblePath } from './common';
import { iVerse } from './verse';

export const COMMENTARY_URL = 'https://www.revisedenglishversion.com/jsondload.php?fil=202';

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

export interface iCommentaryJson {
  REV_Commentary: iStringCommentary[];
  updated?: Date;
}

export class Commentary {
  private _data: iVerse[];

  constructor(data: iVerse[]) {
    this._data = data;
  }

  public get data(): iVerse[] {
    return this._data;
  }

  getBooks(): string[] {
    const booksArray = this._data.map(v => v.path.book);
    const bookSet = new Set(booksArray);
    return Array.from(bookSet);
  }

  getChapters(book: string): number[] {
    const chapterArray = this._data.filter(v => v.path.book === book && v.texts.commentary.length > 0).map(v => v.path.chapter);
    const chapterSet = new Set(chapterArray);
    return Array.from(chapterSet);
  }

  getVerses(book: string, chapter: number): number[] {
    const verseArray = this._data.filter(v => v.path.book === book && v.path.chapter === chapter && v.texts.commentary.length > 0).map(v => v.path.verse);
    const verseSet = new Set(verseArray);
    return Array.from(verseSet);
  }

  getCommentary(book: string, chapter: number, verse: number): string[] {
    const verseArray = this._data.filter(v => v.path.book === book && v.path.chapter === chapter && v.path.verse === verse).map(v => v.texts.commentary);
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
