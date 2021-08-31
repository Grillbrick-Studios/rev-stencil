import { Component, Host, h, Prop } from '@stencil/core';
import { Appendices } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'appendix-view',
  styleUrl: 'appendix-view.css',
  shadow: false,
})
export class AppendixView {
  @Prop() appendix: Appendices;

  render() {
    if (!this.appendix)
      return (
        <Host>
          <ion-title class="title">Please wait until commentary loads.</ion-title>
        </Host>
      );

    if (!state.book)
      return (
        <Host>
          <ion-title class="title"> Please select an Appendix</ion-title>
        </Host>
      );

    return (
      <Host>
        <p class="content" innerHTML={this.appendix.getAppendix(state.book)}></p>
      </Host>
    );
  }
}
