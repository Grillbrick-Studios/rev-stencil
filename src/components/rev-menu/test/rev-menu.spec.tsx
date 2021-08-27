import { newSpecPage } from '@stencil/core/testing';
import { RevMenu } from '../rev-menu';

describe('rev-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [RevMenu],
      html: `<rev-menu></rev-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <rev-menu>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </rev-menu>
    `);
  });
});
