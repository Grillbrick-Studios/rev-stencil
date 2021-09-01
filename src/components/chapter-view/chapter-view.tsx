import { Component, Host, h, Prop } from '@stencil/core';
import { Bible } from '../../models';
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
          <ion-title class="title"> Please select a book & chapter.</ion-title>
          <ion-list>
            <ion-chip onClick={() => (state.resource = undefined)}>
              <ion-label color="dark">{state.resource}</ion-label>
              <ion-icon name="close-circle" />
            </ion-chip>
            {state.book && (
              <ion-chip onClick={() => (state.book = undefined)}>
                <ion-label color="dark">{state.book}</ion-label>
                <ion-icon name="close-circle" />
              </ion-chip>
            )}
            <br />
            {!state.book
              ? this.bible.getBooks().map(b => [<ion-button onClick={() => (state.book = b)}>{b}</ion-button>])
              : this.bible.getChapters(state.book).map(c => [<ion-button onClick={() => (state.chapter = c)}>{c}</ion-button>])}
          </ion-list>
        </Host>
      );

    return (
      <Host>
        <ion-title class="title">
          {state.book} {state.chapter}
        </ion-title>
        <p
          class="content"
          innerHTML={this.bible
            .getVerses(state.book, state.chapter)
            .map(v => v.html())
            .join('\n')}
        ></p>
      </Host>
    );
  }
}
