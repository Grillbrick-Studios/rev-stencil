import { Component, Host, h, Prop } from '@stencil/core';
import { Commentary } from '../../models';
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
          <ion-title class="title"> Please select a book, chapter, & verse.</ion-title>
          <ion-list>
            <ion-chip onClick={() => (state.resource = undefined)}>
              <ion-label color="dark">{state.resource}</ion-label>
              <ion-icon name="close-circle" />
            </ion-chip>
            {state.book && (
              <ion-chip
                onClick={() => {
                  state.book = undefined;
                }}
              >
                <ion-label color="dark">{state.book}</ion-label>
                <ion-icon name="close-circle" />
              </ion-chip>
            )}
            {state.chapter && (
              <ion-chip
                onClick={() => {
                  state.chapter = undefined;
                }}
              >
                <ion-label color="dark">{state.chapter}</ion-label>
                <ion-icon name="close-circle" />
              </ion-chip>
            )}
            <br />
            {!state.book
              ? this.commentary.getBooks().map(b => [<ion-button onClick={() => (state.book = b)}>{b}</ion-button>])
              : !state.chapter
              ? this.commentary.getChapters(state.book).map(c => [<ion-button onClick={() => (state.chapter = parseInt(c))}>{c}</ion-button>])
              : this.commentary.getVerses(state.book, state.chapter).map(v => [<ion-button onClick={() => (state.verse = parseInt(v))}>{v}</ion-button>])}
          </ion-list>
        </Host>
      );

    return (
      <Host>
        <ion-title class="title">
          Commentary for {state.book} {state.chapter}:{state.verse}
        </ion-title>
        <p class="content" innerHTML={this.commentary.getVerses(state.book, state.chapter, state.verse).join('\n')}></p>
      </Host>
    );
  }
}
