import { newE2EPage } from '@stencil/core/testing';

describe('rev-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<rev-menu></rev-menu>');

    const element = await page.find('rev-menu');
    expect(element).toHaveClass('hydrated');
  });
});
