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
    const colClass = `col${state.numColumns}container`;

    if (!state.book || !state.chapter)
      return (
        <Host>
          <ion-list>
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
            {!state.book
              ? [<hr />, <p class="heading">Appendices</p>, <hr />, this.bible.appendices.getTitles().map(a => <ion-button onClick={() => (state.book = a)}>{a}</ion-button>)]
              : []}
          </ion-list>
        </Host>
      );

    return (
      <Host>
        <ion-chip onClick={() => (state.chapter = undefined)}>
          <ion-label>{state.book}</ion-label>
          <ion-icon name="close-circle" onClick={() => (state.book = undefined)} />
        </ion-chip>
        <div class={`content ${colClass}`} innerHTML={this.bible.getChapter(state.book, state.chapter, state)}></div>
      </Host>
    );
  }
}
