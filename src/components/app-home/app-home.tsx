import { Component, h, Prop } from '@stencil/core';
import { Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  scoped: true,
})
export class AppHome {
  @Prop() resource?: Resource;

  connectedCallback() {
    state.resource = this.resource ? this.resource : state.resource;
  }

  render() {
    return (
      <ion-content class="ion-padding">
        <content-view resource={this.resource} />
      </ion-content>
    );
  }
}
