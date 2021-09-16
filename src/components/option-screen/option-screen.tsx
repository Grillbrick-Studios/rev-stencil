import { SelectChangeEventDetail, ToggleChangeEventDetail } from '@ionic/core';
import { Component, Host, h, State, Watch } from '@stencil/core';
import { Bible, ViewMode } from '../../models';
import { DEFAULT_FONT_SIZE, state } from '../../state';

@Component({
  tag: 'option-screen',
  styleUrl: 'option-screen.css',
  shadow: true,
})
export class OptionScreen {
  bible: Bible;
  @State() viewMode: ViewMode;
  @State() linkCommentary: boolean;
  @State() fontSize: number;
  @State() fontFamily: string;

  @Watch('fontSize')
  onFontSizeChange(newValue: number) {
    const root = document.documentElement;

    root.style.setProperty('--example-font-size', `${newValue}px`);
  }

  @Watch('fontFamily')
  onFontFamilyChange(value: string) {
    const root = document.documentElement;

    root.style.setProperty('--example-font-family', value);
  }

  async componentWillLoad() {
    this.bible = await Bible.onReady();
    this.viewMode = state.viewMode;
    this.linkCommentary = state.linkCommentary;
    this.fontSize = state.fontSize;
    this.fontFamily = state.fontFamily;

    this.onFontSizeChange(this.fontSize);
    this.onFontFamilyChange(this.fontFamily);
  }

  render() {
    return (
      <Host>
        <ion-list>
          <ion-item>
            <ion-list>
              <ion-radio-group onIonChange={this.viewModeChange.bind(this)} value={this.viewMode}>
                <ion-list-header>
                  <ion-label>Bible Text Mode</ion-label>
                </ion-list-header>
                <ion-item>
                  <ion-label>Verse Break</ion-label>
                  <ion-radio slot="start" value={ViewMode.VerseBreak} />
                </ion-item>
                <ion-item>
                  <ion-label>Paragraph</ion-label>
                  <ion-radio slot="start" value={ViewMode.Paragraph} />
                </ion-item>
              </ion-radio-group>
            </ion-list>
          </ion-item>

          <ion-item>
            <ion-label>Link Commentary?</ion-label>
            <ion-toggle checked={this.linkCommentary} onIonChange={this.linkCommentaryChange.bind(this)} />
          </ion-item>

          <ion-item>
            <ion-label>Font Size</ion-label>
            <ion-segment>
              <ion-segment-button onClick={() => this.fontSize--}>
                <ion-icon name="remove-outline" />
              </ion-segment-button>
              <ion-segment-button onClick={() => this.fontSize++}>
                <ion-icon name="add-outline" />
              </ion-segment-button>
              <ion-segment-button onClick={() => (this.fontSize = DEFAULT_FONT_SIZE)}>
                <ion-icon name="refresh-outline" />
              </ion-segment-button>
            </ion-segment>
          </ion-item>

          <ion-item>
            <font-picker onFontChange={ev => (this.fontFamily = ev.detail)} value={this.fontFamily} />
          </ion-item>

          <ion-item>
            <ion-button onClick={() => (state.showOptions = false)}>Close</ion-button>
            <ion-button disabled={this.compareOptions()} onClick={this.saveOptions.bind(this)}>
              Save
            </ion-button>
          </ion-item>
        </ion-list>

        <div class="example" id="example">
          <ion-title class="title">Exodus 11</ion-title>
          <p class="content" innerHTML={this.bible.getChapter('Exodus', 11, this)}></p>
        </div>
      </Host>
    );
  }

  viewModeChange(ev: CustomEvent<SelectChangeEventDetail>) {
    this.viewMode = ev.detail.value;
  }

  linkCommentaryChange(ev: CustomEvent<ToggleChangeEventDetail>) {
    this.linkCommentary = ev.detail.checked;
  }

  compareOptions(): boolean {
    return state.viewMode === this.viewMode && state.linkCommentary === this.linkCommentary && state.fontSize === this.fontSize && this.fontFamily === state.fontFamily;
  }

  saveOptions() {
    state.viewMode = this.viewMode;
    state.linkCommentary = this.linkCommentary;
    state.fontSize = this.fontSize;
    state.fontFamily = this.fontFamily;
    state.showOptions = false;
  }
}
