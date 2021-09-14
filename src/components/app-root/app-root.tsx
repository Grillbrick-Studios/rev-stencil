import { Component, h, State } from '@stencil/core';
import { Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @State() showOptions: boolean = false;
  @State() resource?: Resource;

  connectedCallback() {
    state.resource = this.resource ? this.resource : state.resource;
  }

  render() {
    return (
      <ion-app>
        <div class="ion-page" id="main-content">
          <ion-header>
            <ion-toolbar class="flexbase">
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
              <ion-buttons slot="end">
                <ion-button onClick={() => (this.showOptions = !this.showOptions)}>
                  <ion-icon name="settings-outline" />
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">{this.showOptions ? <option-screen /> : <content-view resource={this.resource} />}</ion-content>
        </div>
      </ion-app>
    );
  }
}

function goBack() {
  if (state.resource === Resource.Commentary) state.resource = Resource.Bible;
  if (state.verse) return (state.verse = undefined);
  if (state.chapter) return (state.chapter = undefined);
  if (state.book) return (state.book = undefined);
  state.resource = undefined;
}
