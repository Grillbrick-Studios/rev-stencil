import { newSpecPage } from '@stencil/core/testing';
import { OptionScreen } from '../option-screen';

describe('option-screen', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [OptionScreen],
      html: `<option-screen></option-screen>`,
    });
    expect(page.root).toEqualHtml(`
      <option-screen>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </option-screen>
    `);
  });
});
