import { newSpecPage } from '@stencil/core/testing';
import { ChapterView } from '../chapter-view';

describe('chapter-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ChapterView],
      html: `<chapter-view></chapter-view>`,
    });
    expect(page.root).toEqualHtml(`
      <chapter-view>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </chapter-view>
    `);
  });
});
