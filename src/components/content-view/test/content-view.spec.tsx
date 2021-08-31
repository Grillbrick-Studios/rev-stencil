import { newSpecPage } from '@stencil/core/testing';
import { ContentView } from '../content-view';

describe('content-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ContentView],
      html: `<content-view></content-view>`,
    });
    expect(page.root).toEqualHtml(`
      <content-view>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </content-view>
    `);
  });
});
