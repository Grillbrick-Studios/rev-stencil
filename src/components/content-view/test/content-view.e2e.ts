import { newE2EPage } from '@stencil/core/testing';

describe('content-view', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<content-view></content-view>');

    const element = await page.find('content-view');
    expect(element).toHaveClass('hydrated');
  });
});
