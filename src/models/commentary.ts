import { iData, Asynclock, iSerializeData } from './common';
import { writeFile, readFile } from './filesystem';

const URL = 'https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=commentary';

export interface iCommentary {
  book: string;
  chapter: string;
  verse: string;
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
    if (Commentary._data) return new Commentary(Commentary._data);
    if (await Commentary.load()) return new Commentary(Commentary._data);
    await Commentary.fetch();
    this.lock.disable();
    return new Commentary(Commentary._data);
  }

  getBooks(): string[] {
    const booksArray = Commentary._data.map(v => v.book);
    const bookSet = new Set(booksArray);
    return Array.from(bookSet);
  }

  getChapters(book: string): string[] {
    const chapterArray = Commentary._data.filter(v => v.book === book).map(v => v.chapter);
    const chapterSet = new Set(chapterArray);
    return Array.from(chapterSet);
  }

  getVerses(book: string, chapter: number, verse?: number): string[] {
    if (verse) {
      const verseArray = Commentary._data.filter(v => v.book === book && v.chapter === chapter.toString() && v.verse === verse.toString()).map(v => v.commentary);
      return verseArray;
    }
    const verseArray = Commentary._data.filter(v => v.book === book && v.chapter === chapter.toString()).map(v => v.verse);
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
    if (this.getChapters(this.selectedBook).indexOf(chapter.toString()) >= 0) {
      this.selectedChapter = chapter;
    }
  }

  selectVerse(verse: number): void {
    if (!this.selectedBook || !this.selectedChapter) return;
    if (this.getVerses(this.selectedBook, this.selectedChapter).indexOf(verse.toString()) >= 0) {
      this.selectedVerse = verse;
    }
  }

  ls(): string[] {
    const { selectedVerse, selectedChapter, selectedBook } = this;
    if (selectedBook) {
      if (selectedChapter) {
        if (selectedVerse) {
          return this.getVerses(selectedBook, selectedChapter, selectedVerse);
        }
        return this.getVerses(selectedBook, selectedChapter);
      }
      return this.getChapters(selectedBook);
    }
    return this.getBooks();
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
}
