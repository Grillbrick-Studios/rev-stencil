import { newSpecPage } from '@stencil/core/testing';
import { FontPicker } from '../font-picker';

describe('font-picker', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FontPicker],
      html: `<font-picker></font-picker>`,
    });
    expect(page.root).toEqualHtml(`
      <font-picker>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </font-picker>
    `);
  });
});
