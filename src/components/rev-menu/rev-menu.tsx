import { Component, h, Prop, State, Watch } from '@stencil/core';

import { menuController } from '@ionic/core';

enum Resource {
  Bible,
  Appendix,
  Commentary,
}

@Component({
  tag: 'rev-menu',
  styleUrl: 'rev-menu.css',
  scoped: true,
})
export class RevMenu {
  @Prop() open: boolean;
  @State() resource?: Resource;

  componentWillRender() {
    menuController.enable(true, 'main');
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
    const mainMenu = (
      <ion-menu side="start" menuId="main" contentId="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Main Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-button color="dark" onClick={() => (this.resource = Resource.Bible)}>
              Bible
            </ion-button>
            <br />
            <ion-button color="dark" onClick={() => (this.resource = Resource.Commentary)}>
              Commentary
            </ion-button>
            <br />
            <ion-button color="dark" onClick={() => (this.resource = Resource.Appendix)}>
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
            <ion-button color="dark" onClick={() => (this.resource = undefined)}>
              ..
            </ion-button>
            <br />
            TODO: Render Bible content here
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
            <ion-button color="dark" onClick={() => (this.resource = undefined)}>
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
            <ion-button color="dark" onClick={() => (this.resource = undefined)}>
              ..
            </ion-button>
            <br />
            TODO: Render appendix here{' '}
          </ion-list>
        </ion-content>
      </ion-menu>
    );

    switch (this.resource) {
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
