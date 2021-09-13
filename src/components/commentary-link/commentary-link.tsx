import { Component, Host, h, Prop } from '@stencil/core';
import { Resource } from '../../models';
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
            state.verse = this.verse;
            state.resource = Resource.Commentary;
          }}
        >
          {this.verse}
        </ion-router-link>
      </Host>
    );
  }
}
