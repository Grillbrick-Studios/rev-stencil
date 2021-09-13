import { iData, iSerializeData, Asynclock, BiblePath, stripStyle, DaysSince } from './common';
import { iVerse, Style, Verse, ViewMode } from './verse';
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
      if (DaysSince(Bible.updated) > 7) return false;
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

  getChapter(book: string, chapter: number, viewMode: ViewMode = ViewMode.Paragraph): string {
    //return this.dumpRaw(book, chapter);
    // console.log(this.dumpRaw(book, chapter));
    let spanDepth = 0;
    const verses = this.getVerses(book, chapter).map((v, i, a) => {
      let verse = v.raw();
      let [preverse, midverse, endverse] = ['', '', ''];
      // This is a flag for adding the heading to the top.
      let addHeading = false;

      // Get the previous verse
      const pv = a[i > 0 ? i - 1 : i];
      // check for a style change
      let styleChange =
        pv.style !== v.style || verse.indexOf('[hpbegin]') > -1 || verse.indexOf('[listbegin]') > -1 || verse.indexOf('[hpend]') > -1 || verse.indexOf('[listend]') > -1;
      // if there is no [mvh] tag but there is a heading - note that we need to
      // add the heading
      if (verse.indexOf('[mvh]') === -1) addHeading = true;
      // otherwise replace the heading in the versetext
      else verse = verse.replace(/\[mvh\]/g, v.getHeading());

      switch (viewMode) {
        case ViewMode.Paragraph:
          if (styleChange || spanDepth === 0 || v.paragraph) {
            if (verse.indexOf('[hpbegin]') === -1 && verse.indexOf('[listbegin]') === -1 && verse.indexOf('[hpend]') === -1 && verse.indexOf('[listend]') === -1) {
              if (spanDepth > 0) {
                preverse += '</span>';
                spanDepth -= 1;
              }
              preverse += `<span class="${styleClass(v.style)}">`;
              spanDepth += 1;
            } else if (verse.indexOf('[hpbegin]') > -1 || verse.indexOf('[listbegin]') > -1) {
              if (spanDepth > 0) {
                preverse += '</span><span class="prose">';
                midverse += '</span>';
                spanDepth -= 1;
              }
              midverse += `<span class="${styleClass(v.style)}">`;
              spanDepth += 1;
            } else {
              console.log('hpend found!');
              if (spanDepth > 0) {
                midverse += '</span>';
                spanDepth -= 1;
              }
              midverse += '<span class="prose">';
              spanDepth += 1;
              endverse += '</span>';
              spanDepth -= 1;
            }
          }
          verse = verse?.replace(/\[hpbegin\]/g, midverse);
          verse = verse?.replace(/\[hpend\]/g, midverse);
          verse = verse?.replace(/\[listbegin\]/g, midverse);
          verse = verse?.replace(/\[listend\]/g, midverse);

          verse = verse?.replace(/\[hp\]/g, '<br />');
          verse = verse?.replace(/\[li\]/g, '<br />');
          verse = verse?.replace(/\[lb\]/g, '<br />');
          verse = verse?.replace(/\[br\]/g, '<br />');
          //verse = verse?.replace(/\[fn\]/g, `<fn>${v.footnotes}</fn>`);
          // TODO: Add Footnotes here.
          verse = verse?.replace(/\[fn\]/g, '<fn></fn>');
          verse = verse?.replace(/\[pg\]/g, '<p></p>');
          // block quote ?
          verse = verse?.replace(/\[bq\]/g, '<p class="bq">');
          verse = verse?.replace(/\[\/bq\]/g, '</p>');
          // FINALLY replace the brackets for questionable text.
          verse = stripStyle(verse);

          return `
            ${preverse}
            ${addHeading ? v.getHeading() : ''}
            ${verse}
            ${endverse}
            ${v.isPoetry() ? '<br/>' : ''}
          `;
        case ViewMode.VerseBreak:
          verse = stripStyle(verse);
          return `${addHeading ? v.getHeading() : ''}
            <div class="versebreak">
            ${verse}
            </div>
          `;
      }
    });

    return verses.join('\n');
    /**/
  }

  dumpRaw(book: string, chapter: number): string {
    const verses = this.getVerses(book, chapter).map(v => {
      let verse = v.raw();

      return `
        <span class="versebreak">
        ${verse}
        </span>
        <br/>
      `;
    });

    return verses.join('\n');
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

  public nextChapter(path: BiblePath): BiblePath {
    const chapters = this.getChapters(path.book);
    if (chapters.indexOf(path.chapter + 1) != -1)
      return {
        ...path,
        chapter: path.chapter + 1,
      };
    else {
      const books = this.getBooks();
      const index = books.indexOf(path.book);
      if (books.length > index + 1)
        return {
          ...path,
          book: books[index + 1],
          chapter: 1,
        };
      else return path;
    }
  }

  public prevChapter(path: BiblePath): BiblePath {
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

function styleClass(style: Style) {
  switch (style) {
    case Style.Prose:
      return 'prose';
    case Style.Poetry:
      return 'poetry';
    case Style.PoetryNoPostGap:
      return 'poetry no-post-gap';
    case Style.PoetryPreGap:
      return 'poetry pre-gap';
    case Style.PoetryPreGapNoPostGap:
      return 'poetry pre-gap-no-post-gap';
    case Style.List:
      return 'list';
    case Style.ListNoPostGap:
      return 'list no-post-gap';
    case Style.ListPreGap:
      return 'list pre-gap';
    case Style.ListPreGapNoPostGap:
      return 'list pre-gap-no-post-gap';
  }
}
