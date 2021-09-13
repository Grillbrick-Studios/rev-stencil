import { Commentary } from './commentary';

export enum Style {
  // style: 1    This is flowing text, or prose. See most verses in the NT.
  Prose = 1,
  // style: 2    This is poetry. See Psalms, Proverbs.
  Poetry,
  // style: 3    This is poetry with no small vertical space at the end of the verse. See Ezra 2
  PoetryNoPostGap,
  // style: 4    This is poetry with an extra linebreak before the verse. See Judges 5:6.
  PoetryPreGap,
  // style: 5    This is poetry with an extra linebreak before the verse and no vertical space after the verse. See Ezra 2:36.
  PoetryPreGapNoPostGap,
  // style: 6    This is list style. It's similar to poetry... I can explain later if you want to go there.
  List,
  // style: 7    This is list style with no small vertical space at the end of the verse.
  ListNoPostGap,
  // style: 8    This is list style with an extra linebreak before the verse.
  ListPreGap,
  // style: 9    This is list style with an extra linebreak before the verse and no vertical space after the verse.
  ListPreGapNoPostGap,
}

export interface iVerse {
  book: string;
  chapter: number;
  verse: number;
  heading: string;
  microheading: boolean;
  paragraph: boolean;
  style: Style;
  footnotes: string;
  versetext: string;
}

export enum ViewMode {
  Paragraph,
  VerseBreak,
}

let commentary: Commentary;

Commentary.onReady().then(c => (commentary = c));

export class Verse implements iVerse {
  constructor(data: iVerse) {
    this.book = data.book;
    this.chapter = data.chapter;
    this.verse = data.verse;
    this.heading = data.heading;
    this.microheading = data.microheading;
    this.paragraph = data.paragraph;
    this.style = data.style;
    this.footnotes = data.footnotes;
    this.versetext = data.versetext;
  }

  get hasCommentary(): boolean {
    return commentary.getVerses(this.book, this.chapter).indexOf(this.verse) >= 0;
  }

  book: string;
  chapter: number;
  verse: number;
  heading: string;
  microheading: boolean;
  paragraph: boolean;
  style: number;
  footnotes: string;
  versetext: string;

  public unwrap(): iVerse {
    const { book, chapter, verse, heading, microheading, paragraph, style, footnotes, versetext } = this;
    return {
      book,
      chapter,
      verse,
      heading,
      microheading,
      paragraph,
      style,
      footnotes,
      versetext,
    };
  }

  public getHeading(): string {
    if (!this.heading) return '';

    // wrap the heading in appropriate tags and add the microheading if it
    // exists.
    return `<${this.microheading ? 'p class="microheading"' : 'p class="heading"'}>${this.heading}</p>`;
  }

  // simply add the commentaryLink to the verse
  public raw(): string {
    // First get the heading and versetext
    let { versetext } = this;

    // Generate a verse number link to commentary
    const commentaryLink = this.hasCommentary ? `<sup><commentary-link verse=${this.verse}/></sup>` : `<sup>${this.verse}</sup>`;

    return `${commentaryLink} ${versetext}`;
  }

  public isPoetry(): boolean {
    switch (this.style) {
      case Style.Poetry:
      case Style.PoetryPreGap:
      case Style.PoetryNoPostGap:
      case Style.PoetryPreGapNoPostGap:
        return true;
      default:
        return false;
    }
  }
}
