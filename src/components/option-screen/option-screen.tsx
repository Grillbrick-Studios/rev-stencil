import { Component, Host, h } from '@stencil/core';
import { Bible, ViewMode } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'option-screen',
  styleUrl: 'option-screen.css',
  shadow: true,
})
export class OptionScreen {
  bible: Bible;

  async componentWillLoad() {
    this.bible = await Bible.onReady();
  }

  render() {
    return (
      <Host>
        <div class="modeswitch">
          <ion-label>Verse Break Mode?</ion-label>
          <ion-toggle
            checked={state.viewMode === ViewMode.VerseBreak}
            onIonChange={ev => (ev.detail.checked ? (state.viewMode = ViewMode.VerseBreak) : (state.viewMode = ViewMode.Paragraph))}
          />
        </div>
        <p class="content" innerHTML={this.bible.getChapter('Psalms', 117, state.viewMode)}></p>
      </Host>
    );
  }
}
