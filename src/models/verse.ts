import { ViewOptions } from './bible';
import { iCommentary } from './commentary';
import { BiblePath } from './common';

export interface importVerse {
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

export interface VerseStyling {
  paragraph: boolean;
  microheading: boolean;
  style: Style;
}

export interface Texts {
  heading: string;
  verse: string;
  footnotes: string[];
  commentary: string;
}

export interface iVerse {
  path: BiblePath;
  style: VerseStyling;
  texts: Texts;
}

export enum ViewMode {
  Paragraph,
  VerseBreak,
  Reading,
}

export class Verse implements iVerse {
  static fromOldVerse(data: importVerse, commentary: string): Verse {
    return new Verse({
      path: {
        book: data.book,
        chapter: data.chapter,
        verse: data.verse,
      },
      style: {
        paragraph: data.paragraph,
        microheading: data.microheading,
        style: data.style,
      },
      texts: {
        heading: data.heading,
        verse: data.versetext,
        footnotes: data.footnotes.split(';'),
        commentary,
      },
    });
  }

  addCommentary(data: iCommentary) {
    if (data.book === this.path.book && data.chapter === this.path.chapter && data.verse === this.path.verse) {
      this.texts.commentary = data.commentary;
    }
  }

  constructor(data: iVerse) {
    this.path = data.path;
    this.style = data.style;
    this.texts = data.texts;
  }

  get book(): string {
    return this.path.book;
  }

  get hasCommentary(): boolean {
    return this.texts.commentary.length > 0;
  }

  path: BiblePath;
  style: VerseStyling;
  texts: Texts;

  public unwrap(): iVerse {
    const { path, style, texts } = this;
    return {
      path,
      style,
      texts,
    };
  }

  public getHeading(): string {
    if (!this.texts.heading) return '';

    const heading = this.texts.heading.replace(/\[br\]/g, '<br />');
    // wrap the heading in appropriate tags and add the microheading if it
    // exists.
    return `<${this.style.microheading ? 'p class="microheading"' : 'p class="heading"'}>${heading}</p>`;
  }

  // simply add the commentaryLink to the verse
  public raw(
    { linkCommentary, viewMode }: ViewOptions = {
      viewMode: ViewMode.Paragraph,
      linkCommentary: true,
    },
  ): string {
    // First get the heading and versetext
    let {
      texts: { verse },
    } = this;

    if (viewMode === ViewMode.Reading) {
      return verse;
    }

    // Generate a verse number link to commentary
    const path = this.path as BiblePath;
    const commentaryLink = this.hasCommentary && linkCommentary ? `<sup><commentary-link verse=${path.verse}/></sup>` : `<sup>${path.verse}</sup>`;

    return `${commentaryLink} ${verse}`;
  }

  public isPoetry(): boolean {
    switch (this.style.style) {
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
