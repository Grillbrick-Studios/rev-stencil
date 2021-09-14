import { Component, Host, h } from '@stencil/core';
import { ViewMode } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'option-screen',
  styleUrl: 'option-screen.css',
  shadow: true,
})
export class OptionScreen {
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
        <slot></slot>
      </Host>
    );
  }
}
