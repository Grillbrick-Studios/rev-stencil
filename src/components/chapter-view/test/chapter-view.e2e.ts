import { newE2EPage } from '@stencil/core/testing';

describe('chapter-view', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<chapter-view></chapter-view>');

    const element = await page.find('chapter-view');
    expect(element).toHaveClass('hydrated');
  });
});
