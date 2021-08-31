import { Component, h, State } from '@stencil/core';
import { Appendices, Bible, Commentary, Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'content-view',
  styleUrl: 'content-view.css',
  shadow: true,
})
export class ContentView {
  @State() bible: Bible;
  @State() commentary: Commentary;
  @State() appendix: Appendices;

  componentWillLoad() {
    Bible.onReady().then(b => (this.bible = b));
    Commentary.onReady().then(c => (this.commentary = c));
    Appendices.onReady().then(a => (this.appendix = a));
  }

  render() {
    switch (state.resource) {
      case Resource.Bible:
        return <chapter-view bible={this.bible} />;
      case Resource.Appendix:
        return <appendix-view appendix={this.appendix} />;
      case Resource.Commentary:
        return <commentary-view commentary={this.commentary} />;
      default:
        return <ion-title> Please select a resource.</ion-title>;
    }
  }
}
