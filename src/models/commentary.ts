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

  public next(path: BiblePath): BiblePath {
    const chapters = this.getChapters(path.book);
    if (chapters.indexOf(path.chapter + 1) != -1)
      return {
        ...path,
        chapter: path.chapter + 1,
      };
    else {
      const books = this.getBooks();
      const index = books.indexOf(path.book);
      if (books.length > index + 2)
        return {
          ...path,
          book: books[index + 1],
          chapter: 1,
        };
      else return path;
    }
  }

  public prev(path: BiblePath): BiblePath {
    const chapters = this.getChapters(path.book);
    if (chapters.indexOf(path.chapter - 1) != -1)
      return {
        ...path,
        chapter: path.chapter - 1,
      };
    else {
      const books = this.getBooks();
      const index = books.indexOf(path.book);
      if (index - 1 >= 0) {
        // get the last chapter of the book
        const chapters = this.getChapters(books[index - 1]);
        return {
          ...path,
          book: books[index - 1],
          chapter: chapters[chapters.length - 1],
        };
      } else return path;
    }
  }
}
