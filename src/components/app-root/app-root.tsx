import { Component, h, Host, State, Watch } from '@stencil/core';
import { scrollTop } from '../../helpers/utils';
import { Appendices, Bible, BiblePath, Commentary, Resource } from '../../models';
import { state, onChange } from '../../state';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @State() showOptions: boolean = false;
  @State() resource?: Resource;
  @State() bible: Bible;
  @State() commentary: Commentary;
  @State() appendix: Appendices;

  @Watch('showOptions')
  showOptionsUpdate(value: boolean) {
    state.showOptions = value;
  }

  componentWillLoad() {
    document.addEventListener('ionBackButton', (ev: any) => ev.detail.register(10, goBack));
  }

  connectedCallback() {
    state.resource = this.resource ? this.resource : state.resource;
    this.showOptions = state.showOptions;
    onChange('showOptions', value => (this.showOptions = value));
  }

  hasNext(): boolean {
    let path: BiblePath = {
      book: state.book,
      chapter: state.chapter,
      verse: state.verse,
    };

    switch (state.resource) {
      case Resource.Bible:
        return path !== this.bible.nextChapter(path);
      case Resource.Commentary:
        return path !== this.commentary.next(path);
      case Resource.Appendix:
        return path.book !== this.appendix.next(path.book);
    }
  }

  hasPrev(): boolean {
    let path: BiblePath = {
      book: state.book,
      chapter: state.chapter,
      verse: state.verse,
    };

    switch (state.resource) {
      case Resource.Bible:
        return path !== this.bible.prevChapter(path);
      case Resource.Commentary:
        return path !== this.commentary.prev(path);
      case Resource.Appendix:
        return path.book !== this.appendix.prev(path.book);
    }
  }

  next() {
    let path: BiblePath = {
      book: state.book || 'Genesis',
      chapter: state.chapter || 1,
    };

    switch (state.resource) {
      case Resource.Bible:
        path = this.bible.nextChapter(path);
        state.book = path.book;
        state.chapter = path.chapter;
        scrollTop();
        return;
      case Resource.Commentary:
        path.verse = state.verse;
        path = this.commentary.next(path);
        state.book = path.book;
        state.chapter = path.chapter;
        state.verse = path.verse;
        scrollTop();
        return;
      case Resource.Appendix:
        state.book = this.appendix.next(path.book);
        scrollTop();
        return;
    }
  }

  prev() {
    let path: BiblePath = {
      book: state.book || 'Revelation',
      chapter: state.chapter || 22,
    };

    switch (state.resource) {
      case Resource.Bible:
        path = this.bible.prevChapter(path);
        state.book = path.book;
        state.chapter = path.chapter;
        scrollTop();
        return;
      case Resource.Commentary:
        path.verse = state.verse;
        path = this.commentary.prev(path);
        state.book = path.book;
        state.chapter = path.chapter;
        state.verse = path.verse;
        scrollTop();
        return;
      case Resource.Appendix:
        state.book = this.appendix.prev(path.book);
        scrollTop();
        return;
    }
  }

  render() {
    if (!this.bible || !this.commentary || !this.appendix)
      return (
        <Host>
          {this.bible ? (
            <ion-title>Bible Loaded!</ion-title>
          ) : (
            Bible.onReady().then(b => (this.bible = b)) && [<ion-title>Loading Bible...</ion-title>, <ion-progress-bar type="indeterminate" />]
          )}
          {this.commentary ? (
            <ion-title>Commentary Loaded!</ion-title>
          ) : (
            Commentary.onReady().then(c => (this.commentary = c)) && [<ion-title>Loading Commentary...</ion-title>, <ion-progress-bar type="indeterminate" />]
          )}
          {this.appendix ? (
            <ion-title>Appendices Loaded!</ion-title>
          ) : (
            Appendices.onReady().then(a => (this.appendix = a)) && [<ion-title>Loading Appendices...</ion-title>, <ion-progress-bar type="indeterminate" />]
          )}
        </Host>
      );

    return (
      <ion-app>
        <div class="ion-page" id="main-content">
          <ion-header>
            <ion-toolbar class="flexbase">
              <ion-buttons slot="start">
                <ion-button disabled={state.resource === undefined} onClick={() => goBack()}>
                  <ion-icon name="arrow-back-outline" />
                </ion-button>
                <ion-button
                  onClick={() => {
                    state.resource = undefined;
                  }}
                >
                  <ion-icon name="home-outline" />
                </ion-button>
              </ion-buttons>
              <div class="top-heading">
                <ion-buttons>
                  <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                    <ion-icon name="arrow-back-outline" />
                  </ion-button>
                  <ion-title>REV App</ion-title>
                  <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                    <ion-icon name="arrow-forward-outline" />
                  </ion-button>
                </ion-buttons>
              </div>
              <ion-buttons slot="end">
                <ion-button onClick={() => (this.showOptions = !this.showOptions)}>
                  <ion-icon name="settings-outline" />
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding" id="root">
            <content-view resource={this.resource} bible={this.bible} commentary={this.commentary} appendix={this.appendix} />
          </ion-content>
        </div>
      </ion-app>
    );
  }
}

function goBack() {
  if (state.resource === Resource.Commentary) state.resource = Resource.Bible;
  if (state.verse) return (state.verse = undefined);
  if (state.chapter) return (state.chapter = undefined);
  if (state.book) return (state.book = undefined);
  state.resource = undefined;
}
