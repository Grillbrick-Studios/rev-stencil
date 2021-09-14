import { newE2EPage } from '@stencil/core/testing';

describe('option-screen', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<option-screen></option-screen>');

    const element = await page.find('option-screen');
    expect(element).toHaveClass('hydrated');
  });
});
