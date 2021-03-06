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
          <ion-title class="title"> Select Appendix</ion-title>
          <ion-list>
            {this.appendix.getTitles().map(a => [
              <ion-button
                onClick={() => {
                  state.book = a;
                }}
              >
                {a}
              </ion-button>,
            ])}
          </ion-list>
        </Host>
      );

    return (
      <Host>
        <ion-chip onClick={() => (state.book = undefined)}>
          <ion-label>{state.book}</ion-label>
          <ion-icon name="close-circle" />
        </ion-chip>
        <br />
        <p class="content" innerHTML={this.appendix.getAppendix(state.book)}></p>
      </Host>
    );
  }

  next() {
    let book = this.appendix.next(state.book);
    state.book = book;
  }

  prev() {
    let book = this.appendix.prev(state.book);
    state.book = book;
  }
}
