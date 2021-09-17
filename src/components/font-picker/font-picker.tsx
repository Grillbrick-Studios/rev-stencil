import { Component, Host, h, Event, EventEmitter } from '@stencil/core';
import { Font } from '../../models';
import { Fonts } from '../../state';

@Component({
  tag: 'font-picker',
  styleUrl: 'font-picker.css',
  shadow: true,
})
export class FontPicker {
  @Event({
    bubbles: true,
    composed: true,
  })
  fontChange: EventEmitter<Font>;

  render() {
    return (
      <Host>
        <ion-list>
          {Fonts.map((font: Font) => [
            font.heading && font.headingStyle && (
              <ion-list-header
                class="header"
                style={{
                  fontFamily: font.headingStyle,
                }}
              >
                {font.heading}
              </ion-list-header>
            ),
            <ion-item>
              <p
                class="link"
                onClick={() => this.fontChange.emit(font)}
                style={{
                  fontFamily: font.value,
                }}
              >
                {font.label}
              </p>
            </ion-item>,
          ])}
        </ion-list>
      </Host>
    );
  }
}
