import { newE2EPage } from '@stencil/core/testing';

describe('commentary-view', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<commentary-view></commentary-view>');

    const element = await page.find('commentary-view');
    expect(element).toHaveClass('hydrated');
  });
});
