import { Component, Host, h, Prop } from '@stencil/core';
import { Bible } from '../../models';

@Component({
  tag: 'chapter-view',
  styleUrl: 'chapter-view.css',
  shadow: false,
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
        <ion-title>{this.book}</ion-title>
        <ion-content
          innerHTML={this.bible
            .getVerses(this.book, this.chapter)
            .map(v => v.html())
            .join('\n')}
        ></ion-content>
      </Host>
    );
  }
}
