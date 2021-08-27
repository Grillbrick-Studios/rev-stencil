import { Component, h, Watch } from '@stencil/core';
import { menuController } from '@ionic/core';
import { Bible, Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'rev-menu',
  styleUrl: 'rev-menu.css',
  scoped: true,
})
export class RevMenu {
  bible: Bible;

  async componentWillRender() {
    menuController.enable(true, 'main');
    this.bible = await Bible.onReady();
  }

  @Watch('resource') onResourceChange(_: Resource, newValue: Resource) {
    switch (newValue) {
      case Resource.Bible:
        menuController.enable(true, 'bible');
        menuController.open('bible');
        break;
      case Resource.Commentary:
        menuController.enable(true, 'commentary');
        menuController.open('commentary');
        break;
      case Resource.Appendix:
        menuController.enable(true, 'appendix');
        menuController.open('appendix');
        break;
    }
  }

  render() {
    if (!this.bible)
      return (
        <ion-menu side="start" menuId="main" contentId="main-content">
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>Please wait while bible loads.</ion-title>
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
              ? this.bible.getBooks().map(b => [<ion-button onClick={() => (state.book = b)}>{b}</ion-button>, <br />])
              : this.bible.getChapters(state.book).map(c => [
                  <ion-button
                    onClick={() => {
                      state.chapter = c;
                      menuController.close('main');
                    }}
                  >
                    {c}
                  </ion-button>,
                  <br />,
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
              ..
            </ion-button>
            <br />
            TODO: Render commentary here{' '}
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
              ..
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
