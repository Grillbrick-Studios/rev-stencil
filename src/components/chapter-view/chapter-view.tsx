import { Component, Host, h, Prop } from '@stencil/core';
import { Bible } from '../../models';

@Component({
  tag: 'chapter-view',
  styleUrl: 'chapter-view.css',
  scoped: true,
})
export class ChapterView {
  @Prop() book: string;
  @Prop() chapter: number;
  bible: Bible;

  async componentWillLoad() {
    this.bible = await Bible.onReady();
  }

  render() {
    return (
      <Host>
        <ion-title class="title">{this.book}</ion-title>
        <p
          class="content"
          innerHTML={this.bible
            .getVerses(this.book, this.chapter)
            .map(v => v.html())
            .join('\n')}
        ></p>
      </Host>
    );
  }
}
