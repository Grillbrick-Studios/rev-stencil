import { Component, Host, h, Prop } from '@stencil/core';
import { state } from '../../state';

@Component({
  tag: 'commentary-link',
  styleUrl: 'commentary-link.css',
  shadow: true,
})
export class CommentaryLink {
  @Prop() verse: number;

  render() {
    return (
      <Host>
        <ion-router-link
          onClick={() => {
            // does nothing on the options screen
            if (state.showOptions) return;
            state.verse = this.verse;
          }}
        >
          {this.verse}
        </ion-router-link>
      </Host>
    );
  }
}
