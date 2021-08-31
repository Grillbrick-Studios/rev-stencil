import { Component, Host, h, Prop } from '@stencil/core';
import { Commentary } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'commentary-view',
  styleUrl: 'commentary-view.css',
  shadow: true,
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

    if (!state.verse)
      return (
        <Host>
          <ion-title> Please select a verse.</ion-title>
        </Host>
      );

    return (
      <Host>
        <ion-title class="title">
          {state.book} {state.chapter}:{state.verse}
        </ion-title>
        <p class="content" innerHTML={this.commentary.getVerses(state.book, state.chapter, state.verse).join('\n')}></p>
      </Host>
    );
  }
}
