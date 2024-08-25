import { describe, it, expect, vi } from 'vitest';
import { mockComponent, mountSuspended } from '@nuxt/test-utils/runtime';
import { h } from 'vue';
import DefaultLayout from '@/layouts/default.vue';

describe('DefaultLayout.vue', () => {
  // BaseHeaderとBaseFooterをモック
  mockComponent('BaseHeader', {
    template: '<header>Mocked Header</header>',
  });
  mockComponent('BaseFooter', {
    template: '<footer>Mocked Footer</footer>',
  });

  it('renders BaseHeader, BaseFooter, and slot content correctly', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: {
        default: () => h('div', 'Test Slot Content'), // スロットを関数形式で定義し、h関数を使用してHTML要素を作成
      },
    });

    // BaseHeaderがモックされて存在することを確認
    expect(wrapper.html()).toContain('<header>Mocked Header</header>');

    // BaseFooterがモックされて存在することを確認
    expect(wrapper.html()).toContain('<footer>Mocked Footer</footer>');

    // スロットコンテンツが正しくレンダリングされていることを確認
    expect(wrapper.html()).toContain('<div>Test Slot Content</div>');
  });
});