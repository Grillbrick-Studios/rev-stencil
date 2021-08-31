import { newSpecPage } from '@stencil/core/testing';
import { CommentaryView } from '../commentary-view';

describe('commentary-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CommentaryView],
      html: `<commentary-view></commentary-view>`,
    });
    expect(page.root).toEqualHtml(`
      <commentary-view>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </commentary-view>
    `);
  });
});
