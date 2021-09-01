import { Component, h } from '@stencil/core';
import { state } from '../../state';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  render() {
    return (
      <ion-app>
        <div class="ion-page" id="main-content">
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-button disabled={state.resource === undefined} onClick={() => goBack()}>
                  <ion-icon name="arrow-back-outline" />
                </ion-button>
                <ion-button
                  onClick={() => {
                    state.resource = undefined;
                  }}
                >
                  <ion-icon name="home-outline" />
                </ion-button>
              </ion-buttons>
              <ion-title>REV App</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-router useHash={false}>
            <ion-route url="/" component="app-home" />
            <ion-route url="/:resource" component="app-home" />
            <ion-route url="/:resource/:book" component="app-home" />
            <ion-route url="/:resource/:book/:chapter" component="app-home" />
            <ion-route url="/:resource/:book/:chapter/:verse" component="app-home" />
          </ion-router>
          <ion-content class="ion-padding" scrollEvents={true} scrollY={true}>
            <ion-nav swipeGesture={true} />
          </ion-content>
        </div>
      </ion-app>
    );
  }
}

function goBack() {
  if (state.verse) return (state.verse = undefined);
  if (state.chapter) return (state.chapter = undefined);
  if (state.book) return (state.book = undefined);
  state.resource = undefined;
}
