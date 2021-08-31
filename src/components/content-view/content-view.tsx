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
          {this.bible ? <ion-title>Bible Loaded!</ion-title> : Bible.onReady().then(b => (this.bible = b)) && <ion-title>Loading Bible...</ion-title>}
          {this.commentary ? <ion-title>Commentary Loaded!</ion-title> : Commentary.onReady().then(c => (this.commentary = c)) && <ion-title>Loading Commentary...</ion-title>}
          {this.appendix ? <ion-title>Appendices Loaded!</ion-title> : Appendices.onReady().then(a => (this.appendix = a)) || <ion-title>Loading Appendices...</ion-title>}
        </Host>
      );
    switch (state.resource) {
      case Resource.Bible:
        return <chapter-view bible={this.bible} />;
      case Resource.Appendix:
        return <appendix-view appendix={this.appendix} />;
      case Resource.Commentary:
        return <commentary-view commentary={this.commentary} />;
      default:
        return <ion-title class="title"> Please select a resource.</ion-title>;
    }
  }
}
