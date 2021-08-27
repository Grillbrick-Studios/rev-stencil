import { Component, Host, h } from '@stencil/core';
import { Bible } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'chapter-view',
  styleUrl: 'chapter-view.css',
  scoped: true,
})
export class ChapterView {
  bible: Bible;

  async componentWillLoad() {
    this.bible = await Bible.onReady();
  }

  render() {
    if (!this.bible)
      return (
        <Host>
          <ion-title class="title">Please wait until bible loads.</ion-title>
        </Host>
      );

    if (!state.book)
      return (
        <Host>
          <ion-title> Please select a book.</ion-title>
        </Host>
      );

    if (!state.chapter)
      return (
        <Host>
          <ion-title> Please select a chapter.</ion-title>
        </Host>
      );

    return (
      <Host>
        <ion-title class="title">{state.book}</ion-title>
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
