import { Component, h, Host, Prop } from '@stencil/core';
import { Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  scoped: true,
})
export class AppHome {
  @Prop() resource?: Resource;
  @Prop() book?: string;
  @Prop() chapter?: number;
  @Prop() verse?: number;
  nav: HTMLIonNavElement;

  constructor() {
    this.nav = document.querySelector('ion-nav');
  }

  connectedCallback() {
    state.resource = this.resource ? this.resource : state.resource;
    state.book = this.book ? this.book : state.book;
    state.chapter = this.chapter ? this.chapter : state.chapter;
    state.verse = this.verse ? this.verse : state.verse;
    if (window.location.pathname !== '/') window.history.replaceState(null, null, '/');
    //console.log(window.location.pathname);
  }

  render() {
    return (
      <Host>
        <content-view resource={this.resource} />
      </Host>
    );
  }
}
