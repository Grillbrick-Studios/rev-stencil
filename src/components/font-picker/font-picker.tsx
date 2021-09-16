import { PickerButton } from '@ionic/core';
import { Component, Host, h, Prop } from '@stencil/core';
import { SansSerifFonts, SerifFonts } from '../../state';

@Component({
  tag: 'font-picker',
  styleUrl: 'font-picker.css',
  shadow: true,
})
export class FontPicker {
  @Prop() onFontChange: (family: string) => any;
  @Prop() value: string;

  render() {
    return (
      <Host>
        <ion-label>Select Font Family</ion-label>
        <ion-select placeholder={this.value} onIonChange={ev => this.onFontChange(ev.detail.value)}>
          <ion-label>Sans Serif Fonts</ion-label>
          {SansSerifFonts.map(font => (
            <ion-select-option value={`${font}, sans-serif`}>{font}</ion-select-option>
          ))}
          <ion-label>Serif Fonts</ion-label>
          {SerifFonts.map(font => (
            <ion-select-option value={`${font}, serif`}>{font}</ion-select-option>
          ))}
        </ion-select>
      </Host>
    );
  }
}
