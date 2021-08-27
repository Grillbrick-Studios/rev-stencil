import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  scoped: true,
})
export class AppHome {
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
            <p class="content"></p>
          </ion-content>
        </div>
      </ion-app>
    );
  }
}
