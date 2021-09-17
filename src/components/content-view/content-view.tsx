import { Component, h, Host, State } from '@stencil/core';
import { Appendices, Bible, Commentary, Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'content-view',
  styleUrl: 'content-view.css',
  shadow: false,
})
export class ContentView {
  @State() bible: Bible;
  @State() commentary: Commentary;
  @State() appendix: Appendices;

  render() {
    if (!this.bible || !this.commentary || !this.appendix)
      return (
        <Host>
          {this.bible ? (
            <ion-title>Bible Loaded!</ion-title>
          ) : (
            Bible.onReady().then(b => (this.bible = b)) && [<ion-title>Loading Bible...</ion-title>, <ion-progress-bar type="indeterminate" />]
          )}
          {this.commentary ? (
            <ion-title>Commentary Loaded!</ion-title>
          ) : (
            Commentary.onReady().then(c => (this.commentary = c)) && [<ion-title>Loading Commentary...</ion-title>, <ion-progress-bar type="indeterminate" />]
          )}
          {this.appendix ? (
            <ion-title>Appendices Loaded!</ion-title>
          ) : (
            Appendices.onReady().then(a => (this.appendix = a)) && [<ion-title>Loading Appendices...</ion-title>, <ion-progress-bar type="indeterminate" />]
          )}
        </Host>
      );

    if (state.showOptions)
      return (
        <Host>
          <option-screen />
        </Host>
      );
    switch (state.resource) {
      case Resource.Bible:
        return (
          <Host>
            <chapter-view bible={this.bible} />
          </Host>
        );
      case Resource.Appendix:
        return (
          <Host>
            <appendix-view appendix={this.appendix} />
          </Host>
        );
      case Resource.Commentary:
        return (
          <Host>
            <commentary-view commentary={this.commentary} />
          </Host>
        );
      default:
        return (
          <Host>
            <ion-title class="title"> Select resource.</ion-title>
            <ion-list>
              <ion-item>
                <ion-button onClick={() => (state.resource = Resource.Bible)}>Bible</ion-button>
              </ion-item>
              <ion-item>
                <ion-button onClick={() => (state.resource = Resource.Commentary)}>Commentary</ion-button>
              </ion-item>
              <ion-item>
                <ion-button onClick={() => (state.resource = Resource.Appendix)}>Appendices</ion-button>
              </ion-item>
            </ion-list>
          </Host>
        );
    }
  }
}
