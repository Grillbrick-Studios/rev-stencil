import { Component, h, Host, State } from '@stencil/core';
import { scrollTop } from '../../helpers/utils';
import { Appendices, Bible, BiblePath, Commentary, Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'content-view',
  styleUrl: 'content-view.css',
  shadow: false,
})
export class ContentView {
  @State() bible: Bible;
  @State() commentary: Commentary;
  @State() appendix: Appendices;

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

    if (state.showOptions)
      return (
        <Host>
          <option-screen />
        </Host>
      );
    switch (state.resource) {
      case Resource.Bible:
        return (
          <Host>
            <div slot="fixed" class="top-heading">
              <ion-buttons class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon name="arrow-back-outline" />
                </ion-button>
                <ion-title class="title">
                  {state.book} {state.chapter}
                </ion-title>
                <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                  <ion-icon name="arrow-forward-outline" />
                </ion-button>
              </ion-buttons>
            </div>
            <chapter-view bible={this.bible} />
            <div class="top-heading">
              <ion-buttons slot="start" class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon name="arrow-back-outline" />
                </ion-button>
                <ion-button onClick={() => scrollTop()}>Top</ion-button>
                <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                  <ion-icon name="arrow-forward-outline" />
                </ion-button>
              </ion-buttons>
            </div>
          </Host>
        );
      case Resource.Appendix:
        return (
          <Host>
            <div slot="fixed" class="top-heading">
              <ion-buttons slot="start" class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon name="arrow-back-outline" />
                </ion-button>
                <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                  <ion-icon name="arrow-forward-outline" />
                </ion-button>
              </ion-buttons>
            </div>
            <appendix-view appendix={this.appendix} />
            <div class="top-heading">
              <ion-buttons slot="start" class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon name="arrow-back-outline" />
                </ion-button>
                <ion-button onClick={() => scrollTop()}>Top</ion-button>
                <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                  <ion-icon name="arrow-forward-outline" />
                </ion-button>
              </ion-buttons>
            </div>
          </Host>
        );
      case Resource.Commentary:
        return (
          <Host>
            <div slot="fixed" class="top-heading">
              <ion-buttons slot="start" class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon name="arrow-back-outline" />
                </ion-button>
                <ion-title class="title">
                  Commentary for
                  <br />
                  {state.book} {state.chapter}
                  {state.verse ? `:${state.verse}` : '?'}
                </ion-title>
                <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                  <ion-icon name="arrow-forward-outline" />
                </ion-button>
              </ion-buttons>
            </div>
            <commentary-view commentary={this.commentary} />
            <div class="top-heading">
              <ion-buttons slot="start" class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon name="arrow-back-outline" />
                </ion-button>
                <ion-button onClick={() => scrollTop()}>Top</ion-button>
                <ion-button onClick={() => this.next()}>
                  <ion-icon name="arrow-forward-outline" />
                </ion-button>
              </ion-buttons>
            </div>
          </Host>
        );
      default:
        return (
          <Host>
            <ion-title class="title"> Select resource.</ion-title>
            <ion-list>
              <ion-item>
                <ion-button onClick={() => (state.resource = Resource.Bible)}>Bible</ion-button>
              </ion-item>
              <ion-item>
                <ion-button onClick={() => (state.resource = Resource.Commentary)}>Commentary</ion-button>
              </ion-item>
              <ion-item>
                <ion-button onClick={() => (state.resource = Resource.Appendix)}>Appendices</ion-button>
              </ion-item>
            </ion-list>
          </Host>
        );
    }
  }
}
