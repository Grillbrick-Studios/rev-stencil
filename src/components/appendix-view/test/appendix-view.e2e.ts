import { newE2EPage } from '@stencil/core/testing';

describe('appendix-view', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<appendix-view></appendix-view>');

    const element = await page.find('appendix-view');
    expect(element).toHaveClass('hydrated');
  });
});
