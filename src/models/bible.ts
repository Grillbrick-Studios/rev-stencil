import { iSerializeData, Asynclock, BiblePath, stripStyle, remoteHasNewer, Resource } from './common';
import { importVerse, iVerse, Style, Verse, ViewMode } from './verse';
import { writeFile, readFile } from './filesystem';
import { Appendices } from './appendices';
import { Commentary, iCommentaryJson, COMMENTARY_URL } from './commentary';
import { iAppendicesJson, APPENDICES_URL, iAppendices } from './appendices';
export const BIBLE_URL = 'https://revbible.com/jsondload.php?fil=201';

export interface iBibleJson {
  // eslint-disable-next-line camelcase
  REV_Bible: importVerse[];
  updated?: Date;
}

export interface ViewOptions {
  viewMode: ViewMode;
  linkCommentary?: boolean;
}

export class Bible {
  verses: Verse[];
  appendices: Appendices;
  updated: Date;
  static lock: Asynclock = new Asynclock();
  remoteDate: Date;

  get commentaries(): Commentary {
    return new Commentary(this.verses);
  }

  public async save() {
    const data: iSerializeData<iVerse> = {
      data: this.verses,
      updated: this.updated,
    };

    await writeFile(data, 'Bible');

    const appendices: iSerializeData<iAppendices> = {
      data: this.appendices.data,
      updated: this.updated,
    };

    await writeFile(appendices, 'Appendices');
  }

  public static async load(): Promise<Bible> {
    try {
      const bibleData: iSerializeData<iVerse> = await readFile('Bible');
      const verses = bibleData.data.map(v => new Verse(v));
      const appendicesData: iSerializeData<iAppendices> = await readFile('Appendices');
      const updated = new Date(bibleData.updated);
      const [newer, _] = await remoteHasNewer(updated);
      if (newer) return;
      return new Bible(verses, appendicesData.data, updated);
    } catch (e) {
      console.error(`Error loading bible from disk: ${e}`);
      return;
    }
  }

  constructor(verses: iVerse[], appendices: iAppendices[], updated: Date) {
    this.verses = verses.map(v => new Verse(v));
    this.appendices = new Appendices(appendices);
    this.updated = updated;
  }

  private static async fetch(): Promise<Bible> {
    console.log('Fetching bible...');
    const bible: iBibleJson = await fetch(BIBLE_URL).then(res => res.json());
    console.log('Fetching commentary...');
    const commentary: iCommentaryJson = await fetch(COMMENTARY_URL).then(res => res.json());
    console.log('Fetching appendices...');
    const appendicesJson: iAppendicesJson = await fetch(APPENDICES_URL).then(res => res.json());
    console.log('All data fetched!');
    const verses = bible.REV_Bible.map(v =>
      Verse.fromOldVerse(v, commentary.REV_Commentary.filter(c => c.book === v.book && c.chapter === v.chapter.toString() && c.verse === v.verse.toString())[0]?.commentary || ''),
    );
    const [_, remoteDate] = await remoteHasNewer(new Date());
    const updated = remoteDate;
    let data = new Bible(verses, appendicesJson.REV_Appendices, updated);
    data.save();
    return data;
  }

  static async onReady(): Promise<Bible> {
    await this.lock.promise;
    this.lock.enable();
    try {
      let bible = await Bible.load();
      if (bible) return bible;
      else return await Bible.fetch();
    } catch (e) {
      console.error(e);
    } finally {
      this.lock.disable();
    }
  }

  getBooks(filter: string = ''): string[] {
    const booksArray = this.verses.map(v => v.path.book).filter(b => b.startsWith(filter));
    const bookSet = new Set(booksArray);
    //return new Array(...bookSet.keys());
    return Array.from(bookSet);
  }

  getChapters(book: string): number[] {
    const chaptersArray = this.verses.filter(v => v.path.book === book).map(v => v.path.chapter);
    const chapterSet = new Set(chaptersArray);
    return Array.from(chapterSet);
  }

  getChapter(
    book: string,
    chapter: number,
    { viewMode, linkCommentary }: ViewOptions = {
      viewMode: ViewMode.Paragraph,
      linkCommentary: true,
    },
  ): string {
    //return this.dumpRaw(book, chapter);
    let spanDepth = 0;
    const verses = this.getVerses(book, chapter).map(v => {
      let verse = v.raw({
        viewMode,
        linkCommentary,
      });
      let [preverse, midverse, endverse] = ['', '', ''];
      // This is a flag for adding the heading to the top.
      let addHeading = false;

      // if there is no [mvh] tag but there is a heading - note that we need to
      // add the heading
      if (verse.indexOf('[mvh]') === -1) addHeading = true;
      // otherwise replace the heading in the versetext
      else verse = verse.replace(/\[mvh\]/g, v.getHeading());

      switch (viewMode) {
        case ViewMode.Paragraph:
        case ViewMode.Reading:
          if (v.style.paragraph) {
            if (verse.indexOf('[hpbegin]') === -1 && verse.indexOf('[listbegin]') === -1 && verse.indexOf('[hpend]') === -1 && verse.indexOf('[listend]') === -1) {
              if (spanDepth > 0) {
                preverse += '</span>';
                spanDepth -= 1;
              }
              preverse += `<span class="${styleClass(v.style.style)}">`;
              spanDepth += 1;
            } else if (verse.indexOf('[hpbegin]') > -1 || verse.indexOf('[listbegin]') > -1) {
              if (spanDepth > 0) {
                preverse += '</span><span class="prose">';
                midverse += '</span>';
                spanDepth -= 1;
              }
              midverse += `<span class="${styleClass(v.style.style)}">`;
              spanDepth += 1;
            } else {
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
          verse = verse.replace(/\[hpbegin\]/g, midverse);
          verse = verse.replace(/\[hpend\]/g, midverse);
          verse = verse.replace(/\[listbegin\]/g, midverse);
          verse = verse.replace(/\[listend\]/g, midverse);

          verse = verse.replace(/\[hp\]/g, '<br />');
          verse = verse.replace(/\[li\]/g, '<br />');
          verse = verse.replace(/\[lb\]/g, '<br />');
          verse = verse.replace(/\[br\]/g, '<br />');
          //verse = verse?.replace(/\[fn\]/g, `<fn>${v.texts.footnotes}</fn>`);
          // TODO: Add Footnotes here.
          verse = verse.replace(/\[fn\]/g, '<fn></fn>');
          verse = verse.replace(/\[pg\]/g, '<p></p>');
          // block quote ?
          verse = verse.replace(/\[bq\]/g, '<p class="bq">');
          verse = verse.replace(/\[\/bq\]/g, '</p>');
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
    if (verse) return this.verses.filter(v => v.path.book === book && v.path.chapter === chapter && v.path.verse === verse);
    return this.verses.filter(v => v.path.book === book && v.path.chapter === chapter);
  }

  getVerseNumbers(book: string, chapter: number): number[] {
    return this.getVerses(book, chapter).map(v => v.path.verse);
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

  Resource(path: BiblePath): Resource {
    if (path.book && (path.book.startsWith('Appendix') || path.book.startsWith('Biblio'))) return Resource.Appendix;
    if (path.verse) return Resource.Commentary;
    return Resource.Bible;
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
