import { iData, iSerializeData, Asynclock } from './common';
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
    //console.log(this.dumpRaw(book, chapter));
    const verses = this.getVerses(book, chapter).map((v, i, a) => {
      const pv = a[i > 0 ? i - 1 : i];
      //const nv = a[i < a.length - 1 ? i + 1 : i];
      let verse = v.raw();
      let verseBreak = false;
      // check for a style change
      let styleChange = pv.style !== v.style;
      let spanDepth = 0;
      let [preverse, midverse] = ['', ''];

      // This is a flag for adding the heading to the top.
      let addHeading = false;
      // if there is no [mvh] tag but there is a heading - note that we need to
      // add the heading
      if (verse.indexOf('[mvh]') === -1) addHeading = true;
      // otherwise replace the heading in the versetext
      else verse = verse.replace(/\[mvh\]/g, v.getHeading());

      switch (viewMode) {
        case ViewMode.Paragraph:
          // styling for poetry
          if (styleChange) {
            while (spanDepth > 0) {
              preverse = '</span>';
              spanDepth -= 1;
            }
            if (verse.indexOf('[hpbegin]') === -1 && verse.indexOf('[listbegin]') === -1 && verse.indexOf('[hpend]') === -1 && verse.indexOf('[listend]') === -1) {
              preverse += `<span class="${styleClass(v.style)}">`;
              spanDepth += 1;
            } else {
              midverse = `<span class="${styleClass(v.style)}">`;
              spanDepth += 1;
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
          verse = verse?.replace(/\[fn\]/g, '<footnote />');
          verse = verse?.replace(/\[pg\]/g, '<br />');
          // block quote ?
          verse = verse?.replace(/\[bq\]/g, '<span class="bq">');
          verse = verse?.replace(/\[\/bq\]/g, '</span>');
          break;
        case ViewMode.VerseBreak:
          verse = verse?.replace(/\[hpbegin\]/g, ' ');
          verse = verse?.replace(/\[hpend\]/g, ' ');
          verse = verse?.replace(/\[hp\]/g, ' ');

          verse = verse?.replace(/\[listbegin\]/g, ' ');
          verse = verse?.replace(/\[listend\]/g, ' ');
          verse = verse?.replace(/\[li\]/g, ' ');

          verse = verse?.replace(/\[lb\]/g, ' ');
          verse = verse?.replace(/\[br\]/g, ' ');
          verse = verse?.replace(/\[fn\]/g, ' ');
          verse = verse?.replace(/\[pg\]/g, ' ');
          verse = verse?.replace(/\[bq\]/g, ' ');
          verse = verse?.replace(/\[\/bq\]/g, ' ');
          verseBreak = true;
          break;
      }

      // FINALLY replace the brackets for questionable text.
      verse = verse?.replace(/\[\[/g, '<em class="questionable">');
      verse = verse?.replace(/\]\]/g, '</em>');
      verse = verse?.replace(/\[/g, '<em>');
      verse = verse?.replace(/\]/g, '</em>');

      return `${addHeading ? v.getHeading() : ''}
      ${preverse}
        ${verseBreak ? '<span class="versebreak">' : ''}
        ${verse}
        ${verseBreak ? '</span>' : ''}
        ${v.isPoetry() ? '<br/>' : ''}`;
    });

    return verses.join('\n');
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
