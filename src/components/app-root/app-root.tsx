import { Component, h, Host, State, Watch } from '@stencil/core';
import { scrollTop } from '../../helpers/utils';
import { Bible, BiblePath, Resource } from '../../models';
import { state, onChange, isSmall } from '../../state';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @State() showOptions: boolean = false;
  @State() resource?: Resource;
  @State() bible: Bible;

  get isSmall(): boolean {
    return isSmall();
  }

  @Watch('showOptions')
  showOptionsUpdate(value: boolean) {
    state.showOptions = value;
  }

  componentWillLoad() {
    document.addEventListener('ionBackButton', (ev: any) => ev.detail.register(10, goBack));
  }

  connectedCallback() {
    this.showOptions = state.showOptions;
    onChange('showOptions', value => (this.showOptions = value));
  }

  hasNext(): boolean {
    let path: BiblePath = {
      book: state.book,
      chapter: state.chapter,
      verse: state.verse,
    };

    switch (this.bible.Resource(path)) {
      case Resource.Bible:
        return path !== this.bible.nextChapter(path);
      case Resource.Commentary:
        return path !== this.bible.commentaries.next(path);
      case Resource.Appendix:
        return path.book !== this.bible.appendices.next(path.book);
    }
  }

  hasPrev(): boolean {
    let path: BiblePath = {
      book: state.book,
      chapter: state.chapter,
      verse: state.verse,
    };

    switch (this.bible.Resource(path)) {
      case Resource.Bible:
        return path !== this.bible.prevChapter(path);
      case Resource.Commentary:
        return path !== this.bible.commentaries.prev(path);
      case Resource.Appendix:
        return path.book !== this.bible.appendices.prev(path.book);
    }
  }

  next() {
    let path: BiblePath = {
      book: state.book || 'Genesis',
      chapter: state.chapter || 1,
    };

    switch (this.bible.Resource(path)) {
      case Resource.Bible:
        path = this.bible.nextChapter(path);
        state.book = path.book;
        state.chapter = path.chapter;
        scrollTop();
        return;
      case Resource.Commentary:
        path.verse = state.verse;
        path = this.bible.commentaries.next(path);
        state.book = path.book;
        state.chapter = path.chapter;
        state.verse = path.verse;
        scrollTop();
        return;
      case Resource.Appendix:
        state.book = this.bible.appendices.next(path.book);
        scrollTop();
        return;
    }
  }

  prev() {
    let path: BiblePath = {
      book: state.book || 'Revelation',
      chapter: state.chapter || 22,
    };

    switch (this.bible.Resource(path)) {
      case Resource.Bible:
        path = this.bible.prevChapter(path);
        state.book = path.book;
        state.chapter = path.chapter;
        scrollTop();
        return;
      case Resource.Commentary:
        path.verse = state.verse;
        path = this.bible.commentaries.prev(path);
        state.book = path.book;
        state.chapter = path.chapter;
        state.verse = path.verse;
        scrollTop();
        return;
      case Resource.Appendix:
        state.book = this.bible.appendices.prev(path.book);
        scrollTop();
        return;
    }
  }

  render() {
    if (!this.bible)
      return (
        <Host>
          <ion-content>
            {this.bible ? (
              <ion-title>Bible Loaded!</ion-title>
            ) : (
              Bible.onReady().then(b => (this.bible = b)) && [<ion-title>Loading Bible...</ion-title>, <ion-progress-bar type="indeterminate" />]
            )}
          </ion-content>
        </Host>
      );

    const size = this.isSmall ? 'small' : 'large';

    return (
      <ion-app>
        <div class="ion-page" id="main-content">
          <ion-header>
            <ion-toolbar class="flexbase">
              <ion-buttons slot="start">
                <ion-button disabled={state.book === undefined} onClick={() => goBack()}>
                  <ion-icon size={size} name="caret-back" />
                </ion-button>
                <ion-button
                  onClick={() => {
                    state.book = undefined;
                  }}
                >
                  <ion-icon size={size} name="home-outline" />
                </ion-button>
              </ion-buttons>
              <div class="top-heading">
                <ion-buttons>
                  <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                    <ion-icon size={size} name="chevron-back" />
                  </ion-button>
                  {this.isSmall || <ion-icon size={size} name="book" />}
                  <ion-title>{state.heading || 'REV'}</ion-title>
                  <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                    <ion-icon size={size} name="chevron-forward" />
                  </ion-button>
                </ion-buttons>
              </div>
              <ion-buttons slot="end">
                <ion-button onClick={() => (this.showOptions = !this.showOptions)}>
                  <ion-icon size={size} name="settings-outline" />
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding" id="root">
            <content-view resource={this.resource} bible={this.bible} />
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '400px',
              }}
            >
              &nbsp;
            </span>
          </ion-content>
        </div>
      </ion-app>
    );
  }
}

function goBack() {
  if (state.verse) return (state.verse = undefined);
  if (state.chapter) return (state.chapter = undefined);
  if (state.book) return (state.book = undefined);
}
