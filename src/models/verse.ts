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
  microheading: number;
  paragraph: number;
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
    return commentary.getVerses(this.book, this.chapter).indexOf(this.verse.toString()) >= 0;
  }

  book: string;
  chapter: number;
  verse: number;
  heading: string;
  microheading: number;
  paragraph: number;
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

  public raw(): string {
    // First get the heading and versetext
    let { heading, versetext } = this;

    // wrap the heading in appropriate tags and add the microheading if it
    // exists.
    heading = `<h2>${heading}</h2>${this.microheading ? `<h3>${this.microheading}</h3>` : ''}`;

    // This is a flag for adding the heading to the top.
    let addHeading = false;

    // if there is no [mvh] tag but there is a heading - note that we need to
    // add the heading
    if (versetext.indexOf('[mvh]') === -1 && this.heading) addHeading = true;
    // otherwise replace the heading in the versetext
    else versetext = versetext.replace(/\[mvh\]/g, heading);

    // Generate a verse number link to commentary
    const commentaryLink = this.hasCommentary
      ? `<sup><ion-router-link href="/Commentary/${this.book}/${this.chapter}/${this.verse}">${this.verse}</ion-router-link></sup>`
      : `<sup>${this.verse}</sup>`;

    return `${addHeading ? heading : ''} ${commentaryLink} ${versetext}`;
  }

  public html(mode: ViewMode = ViewMode.Paragraph): string {
    // First get the heading and versetext
    let { heading, versetext } = this;
    // This is a flag for adding the heading to the top.
    let addHeading = false,
      verseBreak = false;

    // Generate a verse number link to commentary
    const commentaryLink = this.hasCommentary
      ? `<sup><ion-router-link href="/Commentary/${this.book}/${this.chapter}/${this.verse}">${this.verse}</ion-router-link></sup>`
      : `<sup>${this.verse}</sup>`;

    // wrap the heading in appropriate tags and add the microheading if it
    // exists.
    heading = `<h2>${heading}</h2>${this.microheading ? `<h3>${this.microheading}</h3>` : ''}`;

    // if there is no [mvh] tag but there is a heading - note that we need to
    // add the heading
    if (versetext.indexOf('[mvh]') === -1 && this.heading) addHeading = true;
    // otherwise replace the heading in the versetext
    else versetext = versetext.replace(/\[mvh\]/g, heading);

    // Format according te the viewMode
    switch (mode) {
      case ViewMode.Paragraph:
        versetext = versetext?.replace(/\[hp\]/g, ' ');
        versetext = versetext?.replace(/\[hpbegin\]/g, ' ');
        versetext = versetext?.replace(/\[hpend\]/g, ' ');
        versetext = versetext?.replace(/\[li\]/g, ' ');
        versetext = versetext?.replace(/\[listbegin\]/g, ' ');
        versetext = versetext?.replace(/\[listend\]/g, ' ');
        versetext = versetext?.replace(/\[lb\]/g, '<br />');
        versetext = versetext?.replace(/\[br\]/g, '<br />');
        versetext = versetext?.replace(/\[fn\]/g, '<footnote />');
        versetext = versetext?.replace(/\[pg\]/g, '<br />');
        versetext = versetext?.replace(/\[bq\]/g, '<span class="bq">');
        versetext = versetext?.replace(/\[\/bq\]/g, '</span>');
        break;
      case ViewMode.VerseBreak:
        versetext = versetext?.replace(/\[hp\]/g, ' ');
        versetext = versetext?.replace(/\[hpbegin\]/g, ' ');
        versetext = versetext?.replace(/\[hpend\]/g, ' ');
        versetext = versetext?.replace(/\[li\]/g, ' ');
        versetext = versetext?.replace(/\[listbegin\]/g, ' ');
        versetext = versetext?.replace(/\[listend\]/g, ' ');
        versetext = versetext?.replace(/\[lb\]/g, ' ');
        versetext = versetext?.replace(/\[br\]/g, ' ');
        versetext = versetext?.replace(/\[fn\]/g, ' ');
        versetext = versetext?.replace(/\[pg\]/g, ' ');
        versetext = versetext?.replace(/\[bq\]/g, ' ');
        versetext = versetext?.replace(/\[\/bq\]/g, ' ');
        verseBreak = true;
        break;
    }

    // FINALLY replace the brackets for questionable text.
    versetext = versetext?.replace(/\[\[/g, '<em>');
    versetext = versetext?.replace(/\]\]/g, '</em>');
    versetext = versetext?.replace(/\[/g, "<em style='font-weight: lighter;'>");
    versetext = versetext?.replace(/\]/g, '</em>');

    // Put it all together
    return `${addHeading ? heading : ''} ${verseBreak ? '<div class="verse">' : ''}${commentaryLink} ${versetext}${verseBreak ? '</div>' : ''}`;
  }
}
