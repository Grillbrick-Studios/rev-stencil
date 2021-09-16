import { newE2EPage } from '@stencil/core/testing';

describe('font-picker', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<font-picker></font-picker>');

    const element = await page.find('font-picker');
    expect(element).toHaveClass('hydrated');
  });
});
