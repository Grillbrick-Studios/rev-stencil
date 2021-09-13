import { newE2EPage } from '@stencil/core/testing';

describe('commentary-link', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<commentary-link></commentary-link>');

    const element = await page.find('commentary-link');
    expect(element).toHaveClass('hydrated');
  });
});
