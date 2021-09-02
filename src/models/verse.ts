import { Commentary } from './commentary';

export interface iVerse {
  book: string;
  chapter: number;
  verse: number;
  heading: string;
  microheading: number;
  paragraph: number;
  style: number;
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

  public html(mode: ViewMode = ViewMode.Paragraph): string {
    let result = this.hasCommentary
      ? `<sup><ion-router-link href="/Commentary/${this.book}/${this.chapter}/${this.verse}">${this.verse}</ion-router-link></sup> ${this.versetext}`
      : `<sup>${this.verse}</sup> ${this.versetext}`;
    if (result.indexOf('[mvh]') === -1 && this.heading) result = `<h2>${this.heading}</h2>${this.microheading ? `<h3>${this.microheading}</h3>${result}` : ''}`;
    else
      result = result?.replace(
        /\[mvh\]/g,
        `
      <h2>${this.heading}</h2>
      ${this.microheading ? `<h3>${this.microheading}</h3>` : ''}
      `,
      );

    switch (mode) {
      case ViewMode.Paragraph:
        result = result?.replace(/\[hp\]/g, ' ');
        result = result?.replace(/\[hpbegin\]/g, ' ');
        result = result?.replace(/\[hpend\]/g, ' ');
        result = result?.replace(/\[li\]/g, ' ');
        result = result?.replace(/\[listbegin\]/g, ' ');
        result = result?.replace(/\[listend\]/g, ' ');
        result = result?.replace(/\[lb\]/g, '<br />');
        result = result?.replace(/\[br\]/g, '<br />');
        result = result?.replace(/\[fn\]/g, '<footnote />');
        result = result?.replace(/\[pg\]/g, '<br />');
        result = result?.replace(/\[bq\]/g, '<span class="bq">');
        result = result?.replace(/\[\/bq\]/g, '</span>');
        break;
      case ViewMode.VerseBreak:
        result = result?.replace(/\[hp\]/g, ' ');
        result = result?.replace(/\[hpbegin\]/g, ' ');
        result = result?.replace(/\[hpend\]/g, ' ');
        result = result?.replace(/\[li\]/g, ' ');
        result = result?.replace(/\[listbegin\]/g, ' ');
        result = result?.replace(/\[listend\]/g, ' ');
        result = result?.replace(/\[lb\]/g, ' ');
        result = result?.replace(/\[br\]/g, ' ');
        result = result?.replace(/\[fn\]/g, ' ');
        result = result?.replace(/\[pg\]/g, ' ');
        result = result?.replace(/\[bq\]/g, ' ');
        result = result?.replace(/\[\/bq\]/g, ' ');
        result = `<div class="verse">${result}</div>`;
        break;
    }
    result = result?.replace(/\[\[/g, '<em>');
    result = result?.replace(/\]\]/g, '</em>');
    result = result?.replace(/\[/g, "<em style='font-weight: lighter;'>");
    result = result?.replace(/\]/g, '</em>');
    return result;
  }
}
