import { newSpecPage } from '@stencil/core/testing';
import { CommentaryLink } from '../commentary-link';

describe('commentary-link', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CommentaryLink],
      html: `<commentary-link></commentary-link>`,
    });
    expect(page.root).toEqualHtml(`
      <commentary-link>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </commentary-link>
    `);
  });
});
