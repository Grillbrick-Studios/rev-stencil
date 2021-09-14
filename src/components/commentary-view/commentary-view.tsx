import { Component, Host, h, Prop } from '@stencil/core';
import { BiblePath, Commentary } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'commentary-view',
  styleUrl: 'commentary-view.css',
  shadow: false,
})
export class CommentaryView {
  @Prop() commentary: Commentary;

  render() {
    if (!this.commentary)
      return (
        <Host>
          <ion-title class="title">Please wait until commentary loads.</ion-title>
        </Host>
      );

    if (!state.book || !state.chapter || !state.verse)
      return (
        <Host>
          <ion-title class="title"> select book/chapter/verse.</ion-title>
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
            {state.chapter && (
              <ion-chip onClick={() => (state.verse = undefined)}>
                <ion-label>{state.chapter}</ion-label>
                <ion-icon name="close-circle" onClick={() => (state.chapter = undefined)} />
              </ion-chip>
            )}
            <hr />
            {!state.book
              ? this.commentary.getBooks().map(b => {
                  if (b.toLowerCase().startsWith('gen'))
                    return [<hr />, <p class="heading">Old Testament</p>, <hr />, <ion-button onClick={() => (state.book = b)}>{b}</ion-button>];
                  if (b.toLowerCase().startsWith('matt'))
                    return [<hr />, <p class="heading">New Testament</p>, <hr />, <ion-button onClick={() => (state.book = b)}>{b}</ion-button>];
                  return <ion-button onClick={() => (state.book = b)}>{b}</ion-button>;
                })
              : !state.chapter
              ? this.commentary.getChapters(state.book).map(c => [<ion-button onClick={() => (state.chapter = c)}>{c}</ion-button>])
              : this.commentary.getVerses(state.book, state.chapter).map(v => [<ion-button onClick={() => (state.verse = v as number)}>{v}</ion-button>])}
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
            Commentary for
            <br />
            {state.book} {state.chapter}:{state.verse}
          </ion-title>
          <ion-button onClick={() => this.goForward()}>
            <ion-icon name="arrow-forward-outline" />
          </ion-button>
        </ion-buttons>
        <p class="content" innerHTML={this.commentary.getCommentary(state.book, state.chapter, state.verse).join('\n')}></p>
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
    const { book, chapter, verse } = this.commentary.next(state as BiblePath);
    state.book = book;
    state.chapter = chapter;
    state.verse = verse;
  };

  goBack = () => {
    const { book, chapter, verse } = this.commentary.prev(state as BiblePath);
    state.book = book;
    state.chapter = chapter;
    state.verse = verse;
  };
}
