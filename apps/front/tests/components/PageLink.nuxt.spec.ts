import { describe, it, expect, vi } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import PageLink from '@/components/PageLink.vue';

describe('PageLink.vue', () => {
  it('renders a link with the correct href', async () => {
    const wrapper = await mountSuspended(PageLink, {
      props: {
        to: '/about',
      },
      slots: {
        default: () => 'About Us', // 関数形式でスロットを定義
      },
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>', // NuxtLinkをモックし、hrefにバインド
          },
        },
      },
    });

    // NuxtLinkが正しいhrefを持っているかどうかを確認
    const nuxtLink = wrapper.find('a');
    expect(nuxtLink.exists()).toBe(true);
    expect(nuxtLink.attributes('href')).toBe('/about');
  });

  it('displays the correct slot content', async () => {
    const wrapper = await mountSuspended(PageLink, {
      props: {
        to: '/contact',
      },
      slots: {
        default: () => 'Contact Us', // 関数形式でスロットを定義
      },
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>', // NuxtLinkをモックし、hrefにバインド
          },
        },
      },
    });

    // スロットコンテンツが正しく表示されているかを確認
    const nuxtLink = wrapper.find('a');
    expect(nuxtLink.text()).toBe('Contact Us');
  });

  it('applies correct class styles', async () => {
    const wrapper = await mountSuspended(PageLink, {
      props: {
        to: '/',
      },
      slots: {
        default: () => 'Home', // 関数形式でスロットを定義
      },
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>', // NuxtLinkをモックし、hrefにバインド
          },
        },
      },
    });

    // クラスが正しく適用されているかを確認
    const nuxtLink = wrapper.find('a');
    expect(nuxtLink.classes()).toContain('underline');
    expect(nuxtLink.classes()).toContain('text-gray-400');
    expect(nuxtLink.classes()).toContain('hover:text-gray-200');
    expect(nuxtLink.classes()).toContain('transition-colors');
  });
});
