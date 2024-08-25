import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import PageTitle from '@/components/PageTitle.vue';

describe('PageTitle.vue', () => {
  it('renders the title prop correctly', async () => {
    const wrapper = await mountSuspended(PageTitle, {
      props: {
        title: 'Test Title'
      }
    });

    // h1タグの内容がプロパティで渡されたタイトルと一致するかを確認
    const h1 = wrapper.find('h1');
    expect(h1.exists()).toBe(true);  // h1タグが存在するかを確認
    expect(h1.text()).toBe('Test Title');  // h1タグ内のテキストが期待されるタイトルか確認
  });

  it('applies correct classes to the h1 tag', async () => {
    const wrapper = await mountSuspended(PageTitle, {
      props: {
        title: 'Another Title'
      }
    });

    // h1タグに正しいクラスが適用されているかを確認
    const h1 = wrapper.find('h1');
    expect(h1.classes()).toContain('text-3xl');  // クラス 'text-3xl' が含まれているか確認
    expect(h1.classes()).toContain('font-bold');  // クラス 'font-bold' が含まれているか確認
    expect(h1.classes()).toContain('mb-6');       // クラス 'mb-6' が含まれているか確認
  });
});
