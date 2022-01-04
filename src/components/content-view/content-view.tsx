import { Component, h, Host, Prop } from '@stencil/core';
import { scrollTop } from '../../helpers/utils';
import { Bible, BiblePath, Resource } from '../../models';
import { state } from '../../state';

@Component({
  tag: 'content-view',
  styleUrl: 'content-view.css',
  shadow: false,
})
export class ContentView {
  @Prop() bible: Bible;

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
      verse: state.verse,
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
    let path: BiblePath = {
      book: state.book,
      chapter: state.chapter,
      verse: state.verse,
    };

    if (state.showOptions)
      return (
        <Host>
          <option-screen />
        </Host>
      );
    switch (this.bible.Resource(path)) {
      case Resource.Appendix:
        return (
          <Host>
            <appendix-view appendix={this.bible.appendices} />
            <div class="top-heading">
              <ion-buttons slot="start" class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon size="large" name="chevron-back" />
                </ion-button>
                <ion-button onClick={() => scrollTop()}>Top</ion-button>
                <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                  <ion-icon size="large" name="chevron-forward" />
                </ion-button>
              </ion-buttons>
            </div>
          </Host>
        );
      case Resource.Commentary:
        return (
          <Host>
            <commentary-view bible={this.bible} />
            <div class="top-heading">
              <ion-buttons slot="start" class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon size="large" name="chevron-back" />
                </ion-button>
                <ion-button onClick={() => scrollTop()}>Top</ion-button>
                <ion-button onClick={() => this.next()}>
                  <ion-icon size="large" name="chevron-forward" />
                </ion-button>
              </ion-buttons>
            </div>
          </Host>
        );
      case Resource.Bible:
      default:
        return (
          <Host>
            <chapter-view bible={this.bible} />
            <div class="top-heading">
              <ion-buttons slot="start" class="flexbase">
                <ion-button disabled={!this.hasPrev()} onClick={() => this.prev()}>
                  <ion-icon size="large" name="chevron-back" />
                </ion-button>
                <ion-button onClick={() => scrollTop()}>Top</ion-button>
                <ion-button disabled={!this.hasNext()} onClick={() => this.next()}>
                  <ion-icon size="large" name="chevron-forward" />
                </ion-button>
              </ion-buttons>
            </div>
          </Host>
        );
    }
  }
}
