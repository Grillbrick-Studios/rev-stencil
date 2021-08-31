import { Component, h, State } from '@stencil/core';
import { menuController } from '@ionic/core';
import { Appendices, Bible, Commentary, Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'rev-menu',
  styleUrl: 'rev-menu.css',
  scoped: true,
})
export class RevMenu {
  @State() bible: Bible;
  @State() commentary: Commentary;
  @State() appendix: Appendices;

  componentWillRender() {
    menuController.enable(true, 'main');
    Bible.onReady().then(b => (this.bible = b));
    Commentary.onReady().then(c => (this.commentary = c));
    Appendices.onReady().then(a => (this.appendix = a));
  }

  render() {
    if (!this.bible || !this.commentary || !this.appendix)
      return (
        <ion-menu side="start" menuId="main" contentId="main-content">
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>Loading Resources...</ion-title>
            </ion-toolbar>
          </ion-header>
        </ion-menu>
      );

    const mainMenu = (
      <ion-menu side="start" menuId="main" contentId="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Main Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-button color="dark" onClick={() => (state.resource = Resource.Bible)}>
              Bible
            </ion-button>
            <br />
            <ion-button color="dark" onClick={() => (state.resource = Resource.Commentary)}>
              Commentary
            </ion-button>
            <br />
            <ion-button color="dark" onClick={() => (state.resource = Resource.Appendix)}>
              Appendix
            </ion-button>
          </ion-list>
        </ion-content>
      </ion-menu>
    );

    const bibleMenu = (
      <ion-menu side="start" menuId="main" contentId="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Bible</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-button color="dark" onClick={() => (state.resource = undefined)}>
              {state.resource}
            </ion-button>
            {state.book && (
              <ion-button color="dark" onClick={() => (state.book = undefined)}>
                {state.book}
              </ion-button>
            )}
            <br />
            {!state.book
              ? this.bible.getBooks().map(b => [<ion-button onClick={() => (state.book = b)}>{b}</ion-button>])
              : this.bible.getChapters(state.book).map(c => [
                  <ion-button
                    onClick={() => {
                      state.chapter = c;
                      menuController.close('main');
                    }}
                  >
                    {c}
                  </ion-button>,
                ])}
          </ion-list>
        </ion-content>
      </ion-menu>
    );

    const commentaryMenu = (
      <ion-menu side="start" menuId="main" contentId="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Commentary</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-button color="dark" onClick={() => (state.resource = undefined)}>
              {state.resource}
            </ion-button>
            {state.book && (
              <ion-button
                color="dark"
                onClick={() => {
                  state.book = undefined;
                }}
              >
                {state.book}
              </ion-button>
            )}
            {state.chapter && (
              <ion-button
                color="dark"
                onClick={() => {
                  state.chapter = undefined;
                }}
              >
                {state.chapter}
              </ion-button>
            )}
            <br />
            {!state.book
              ? this.commentary.getBooks().map(b => [<ion-button onClick={() => (state.book = b)}>{b}</ion-button>])
              : !state.chapter
              ? this.commentary.getChapters(state.book).map(c => [<ion-button onClick={() => (state.chapter = parseInt(c))}>{c}</ion-button>])
              : this.commentary.getVerses(state.book, state.chapter).map(v => [
                  <ion-button
                    onClick={() => {
                      state.verse = parseInt(v);
                      menuController.close('main');
                    }}
                  >
                    {v}
                  </ion-button>,
                ])}
          </ion-list>
        </ion-content>
      </ion-menu>
    );

    const appendixMenu = (
      <ion-menu side="start" menuId="main" contentId="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Appendix</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-button color="dark" onClick={() => (state.resource = undefined)}>
              {state.resource}
            </ion-button>
            <br />
            TODO: Render appendix here{' '}
          </ion-list>
        </ion-content>
      </ion-menu>
    );

    switch (state.resource) {
      case Resource.Bible:
        return bibleMenu;
      case Resource.Appendix:
        return appendixMenu;
      case Resource.Commentary:
        return commentaryMenu;
      default:
        return mainMenu;
    }
  }
}
