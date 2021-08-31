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
  @Prop() book?: string;
  @Prop() chapter?: number;
  @Prop() verse?: number;

  componentWillRender() {
    state.resource = this.resource;
    state.book = this.book;
    state.chapter = this.chapter;
    state.verse = this.verse;
  }

  render() {
    return (
      <ion-app>
        <rev-menu />

        <div class="ion-page" id="main-content">
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-menu-button menu="main"></ion-menu-button>
              </ion-buttons>
              <ion-title>REV App</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding">
            <content-view />
          </ion-content>
        </div>
      </ion-app>
    );
  }
}
