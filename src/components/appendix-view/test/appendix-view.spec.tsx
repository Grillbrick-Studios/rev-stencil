import { newSpecPage } from '@stencil/core/testing';
import { AppendixView } from '../appendix-view';

describe('appendix-view', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppendixView],
      html: `<appendix-view></appendix-view>`,
    });
    expect(page.root).toEqualHtml(`
      <appendix-view>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </appendix-view>
    `);
  });
});
