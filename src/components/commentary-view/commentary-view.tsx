import { Component, Host, h, Prop } from '@stencil/core';
import { Bible } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'commentary-view',
  styleUrl: 'commentary-view.css',
  shadow: false,
})
export class CommentaryView {
  @Prop() bible: Bible;

  render() {
    return (
      <Host>
        <p class="heading" innerHTML={this.bible.verses.find(v => v.path.book === state.book && v.path.chapter === state.chapter && v.path.verse === state.verse).texts.verse}></p>
        <p class="content" innerHTML={this.bible.commentaries.getCommentary(state.book, state.chapter, state.verse).join('\n')}></p>
      </Host>
    );
  }
}
