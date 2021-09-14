import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'option-screen',
  styleUrl: 'option-screen.css',
  shadow: true,
})
export class OptionScreen {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
