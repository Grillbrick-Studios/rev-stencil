import { iData, Asynclock, iSerializeData, BiblePath } from './common';
import { writeFile, readFile } from './filesystem';

const URL = 'https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary';

export interface iCommentary {
  book: string;
  chapter: number;
  verse: number;
  commentary: string;
}

interface iCommentaryJson {
  REV_Commentary: iCommentary[];
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
      const commentaryData: iSerializeData<iCommentary> = await readFile('Commentary');
      Commentary._data = commentaryData.data;
      Commentary.updated = new Date(commentaryData.updated);
      return true;
    } catch (e) {
      return false;
    }
  }

  constructor(data: iCommentary[]) {
    Commentary._data = data;
  }

  public get path(): string {
    if (this.selectedVerse) return `Commentary for ${this.selectedBook} ${this.selectedChapter}:${this.selectedVerse}`;
    if (this.selectedChapter) return `Commentary for ${this.selectedBook} ${this.selectedChapter}`;
    if (this.selectedBook) return `Commentary for ${this.selectedBook}`;
    return 'Commentary';
  }

  public get data(): iCommentary[] {
    return Commentary._data;
  }

  private selectedBook?: string;

  private selectedChapter?: number;

  private selectedVerse?: number;

  private static async fetch() {
    console.log('Fetching commentary from web please wait...');
    const res = await fetch(URL);
    console.log('Commentary downloaded!');
    const commentary: iCommentaryJson = await res.json();
    Commentary._data = commentary.REV_Commentary;
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

  getVerses(book: string, chapter: number, verse?: number): (number | string)[] {
    if (verse) {
      const verseArray = Commentary._data.filter(v => v.book === book && v.chapter === chapter && v.verse === verse).map(v => v.commentary);
      return verseArray;
    }
    const verseArray = Commentary._data.filter(v => v.book === book && v.chapter === chapter).map(v => v.verse);
    const verseSet = new Set(verseArray);
    return Array.from(verseSet);
  }

  selectBook(book: string): void {
    if (this.getBooks().indexOf(book) >= 0) {
      this.selectedBook = book;
    }
  }

  selectChapter(chapter: number): void {
    if (!this.selectedBook) return;
    if (this.getChapters(this.selectedBook).indexOf(chapter) >= 0) {
      this.selectedChapter = chapter;
    }
  }

  selectVerse(verse: number): void {
    if (!this.selectedBook || !this.selectedChapter) return;
    if (this.getVerses(this.selectedBook, this.selectedChapter).indexOf(verse.toString()) >= 0) {
      this.selectedVerse = verse;
    }
  }

  up(): boolean {
    if (this.selectedVerse) {
      this.selectedVerse = undefined;
      return true;
    } else if (this.selectedChapter) {
      this.selectedChapter = undefined;
      return true;
    } else if (this.selectedBook) {
      this.selectedBook = undefined;
      return true;
    }
    return false;
  }

  select(target: string): void {
    if (this.selectedVerse) this.selectVerse(parseInt(target));
    else if (this.selectedChapter) this.selectVerse(parseInt(target));
    else if (this.selectedBook) this.selectChapter(parseInt(target));
    else this.selectBook(target);
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
