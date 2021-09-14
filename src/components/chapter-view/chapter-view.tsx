import { Component, Host, h, Prop } from '@stencil/core';
import { Bible, BiblePath, ViewMode } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'chapter-view',
  styleUrl: 'chapter-view.css',
  shadow: false,
})
export class ChapterView {
  @Prop() bible: Bible;

  render() {
    if (!this.bible)
      return (
        <Host>
          <ion-title class="title">Please wait until bible loads.</ion-title>
        </Host>
      );

    if (!state.book || !state.chapter)
      return (
        <Host>
          <ion-title class="title"> select book & chapter.</ion-title>
          <ion-list>
            <ion-chip onClick={() => (state.book = undefined)}>
              <ion-label>{state.resource}</ion-label>
              <ion-icon name="close-circle" onClick={() => (state.resource = undefined)} />
            </ion-chip>
            {state.book && (
              <ion-chip onClick={() => (state.chapter = undefined)}>
                <ion-label>{state.book}</ion-label>
                <ion-icon name="close-circle" onClick={() => (state.book = undefined)} />
              </ion-chip>
            )}
            <hr />
            {!state.book
              ? this.bible.getBooks().map(b => {
                  if (b.toLowerCase().startsWith('gen'))
                    return [<hr />, <p class="heading">Old Testament</p>, <hr />, <ion-button onClick={() => (state.book = b)}>{b}</ion-button>];
                  if (b.toLowerCase().startsWith('matt'))
                    return [<hr />, <p class="heading">New Testament</p>, <hr />, <ion-button onClick={() => (state.book = b)}>{b}</ion-button>];
                  return <ion-button onClick={() => (state.book = b)}>{b}</ion-button>;
                })
              : this.bible.getChapters(state.book).map(c => [<ion-button onClick={() => (state.chapter = c)}>{c}</ion-button>])}
          </ion-list>
        </Host>
      );

    return (
      <Host>
        <ion-buttons slot="start" class="flexbase">
          <ion-button onClick={() => this.goBack()}>
            <ion-icon name="arrow-back-outline" />
          </ion-button>
          <ion-title class="title">
            {state.book} {state.chapter}
          </ion-title>
          <ion-button onClick={() => this.goForward()}>
            <ion-icon name="arrow-forward-outline" />
          </ion-button>
        </ion-buttons>
        <p class="content" innerHTML={this.bible.getChapter(state.book, state.chapter, state.viewMode)}></p>
        <ion-buttons slot="start" class="flexbase">
          <ion-button onClick={() => this.goBack()}>
            <ion-icon name="arrow-back-outline" />
          </ion-button>
          <ion-button onClick={() => this.goForward()}>
            <ion-icon name="arrow-forward-outline" />
          </ion-button>
        </ion-buttons>
      </Host>
    );
  }

  goForward = () => {
    const { book, chapter } = this.bible.nextChapter(state as BiblePath);
    state.book = book;
    state.chapter = chapter;
  };

  goBack = () => {
    const { book, chapter } = this.bible.prevChapter(state as BiblePath);
    state.book = book;
    state.chapter = chapter;
  };
}
