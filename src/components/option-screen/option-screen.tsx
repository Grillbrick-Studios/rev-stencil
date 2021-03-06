import { popoverController, SelectChangeEventDetail, ToggleChangeEventDetail } from '@ionic/core';
import { Component, Host, h, State, Watch } from '@stencil/core';
import { Bible, Font, ViewMode } from '../../models';
import { DEFAULT_FONT_SIZE, isSmall, state } from '../../state';

@Component({
  tag: 'option-screen',
  styleUrl: 'option-screen.css',
  shadow: false,
})
export class OptionScreen {
  bible: Bible;
  @State() viewMode: ViewMode;
  @State() linkCommentary: boolean;
  @State() fontSize: number;
  @State() fontFamily: Font;
  @State() numColumns: number;

  @Watch('fontSize')
  onFontSizeChange(newValue: number) {
    const root = document.documentElement;

    root.style.setProperty('--example-font-size', `${newValue}px`);
  }

  @Watch('fontFamily')
  onFontFamilyChange(value: Font) {
    console.log('Font updated - setting css variable');
    const root = document.documentElement;

    root.style.setProperty('--example-font-family', value.value);
  }

  async presentFonts(_event: MouseEvent) {
    const popover = await popoverController.create({
      component: 'font-picker',
      componentProps: {
        value: this.fontFamily,
      },
    });
    await popover.present();

    popover.addEventListener('fontChange', (evt: CustomEvent<Font>) => {
      console.log('Font selected', evt.detail);
      this.fontFamily = evt.detail;
      popover.dismiss();
    });
  }

  async componentWillLoad() {
    this.bible = await Bible.onReady();
    this.viewMode = state.viewMode;
    this.linkCommentary = state.linkCommentary;
    this.fontSize = state.fontSize;
    this.fontFamily = state.fontFamily;
    this.numColumns = state.numColumns;

    this.onFontSizeChange(this.fontSize);
    this.onFontFamilyChange(this.fontFamily);
  }

  viewModeChange(ev: CustomEvent<SelectChangeEventDetail>) {
    this.viewMode = ev.detail.value;
  }

  linkCommentaryChange(ev: CustomEvent<ToggleChangeEventDetail>) {
    this.linkCommentary = ev.detail.checked;
  }

  compareOptions(): boolean {
    return (
      state.viewMode === this.viewMode &&
      state.linkCommentary === this.linkCommentary &&
      state.fontSize === this.fontSize &&
      state.fontFamily === this.fontFamily &&
      state.numColumns === this.numColumns
    );
  }

  saveOptions() {
    state.viewMode = this.viewMode;
    state.linkCommentary = this.linkCommentary;
    state.fontSize = this.fontSize;
    state.fontFamily = this.fontFamily;
    state.numColumns = this.numColumns;
    state.showOptions = false;
  }

  forceDarkModeChange(ev: CustomEvent<ToggleChangeEventDetail>) {
    state.forceDarkMode = ev.detail.checked;
  }

  moreColumns() {
    const maxColumns = isSmall() ? 1 : 5;
    this.numColumns++;
    if (this.numColumns > maxColumns) this.numColumns = maxColumns;
  }

  lessColumns() {
    this.numColumns--;
    if (this.numColumns < 1) this.numColumns = 1;
  }

  render() {
    const colClass = `col${this.numColumns}container`,
      exampleBook = 'Genesis',
      exampleChapter = 3,
      size = isSmall() ? 'small' : 'large';
    return (
      <Host>
        <ion-list
          style={{
            maxWidth: '500px',
          }}
        >
          <ion-item>
            <ion-list>
              <ion-item>
                <ion-label>Dark Mode?</ion-label>
                <br />
                <ion-toggle checked={state.forceDarkMode} onIonChange={this.forceDarkModeChange.bind(this)} />
              </ion-item>

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
                <ion-item>
                  <ion-label>Reading</ion-label>
                  <ion-radio slot="start" value={ViewMode.Reading} />
                </ion-item>
              </ion-radio-group>
            </ion-list>
          </ion-item>

          <ion-item>
            <ion-label>Link Commentary?</ion-label>
            <ion-toggle checked={this.linkCommentary} onIonChange={this.linkCommentaryChange.bind(this)} />
          </ion-item>

          <ion-item>
            <ion-label>Number of Columns:</ion-label>
            <ion-button color="light" size={size} onClick={this.lessColumns.bind(this)}>
              <ion-icon name="remove-outline" />
            </ion-button>
            <ion-button color="light" size={size} onClick={this.moreColumns.bind(this)}>
              <ion-icon name="add-outline" />
            </ion-button>
          </ion-item>

          <ion-item>
            <ion-label>Font Size:</ion-label>
            <ion-button color="light" size={size} onClick={() => this.fontSize--}>
              <ion-icon name="remove-outline" />
            </ion-button>
            <ion-button color="light" size={size} onClick={() => this.fontSize++}>
              <ion-icon name="add-outline" />
            </ion-button>
            <ion-button color="light" size={size} onClick={() => (this.fontSize = DEFAULT_FONT_SIZE)}>
              <ion-icon name="refresh-outline" />
            </ion-button>
          </ion-item>

          <ion-item>
            <ion-label>Select Font Family:</ion-label>
            <ion-chip
              style={{
                fontFamily: this.fontFamily.value,
              }}
              class="link"
              onClick={this.presentFonts.bind(this)}
            >
              {this.fontFamily.label}
              <ion-icon name="caret-down" />
            </ion-chip>
          </ion-item>

          <ion-item>
            <ion-button onClick={() => (state.showOptions = false)}>Close</ion-button>
            <ion-button disabled={this.compareOptions()} onClick={this.saveOptions.bind(this)}>
              Save
            </ion-button>
          </ion-item>
        </ion-list>

        <div class="example">
          <ion-title class="title">
            {exampleBook} {exampleChapter}
          </ion-title>
          <div class={`example content ${colClass}`} innerHTML={this.bible.getChapter(exampleBook, exampleChapter, this)}></div>
        </div>
      </Host>
    );
  }
}
