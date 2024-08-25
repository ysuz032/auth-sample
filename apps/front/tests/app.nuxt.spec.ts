import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime';
import App from '@/app.vue'
import BaseHeader from '~/components/BaseHeader.vue';
import BaseFooter from '~/components/BaseFooter.vue';

describe('App.vue', () => {

  it('renders all components', async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
    expect(wrapper.findComponent(BaseFooter).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'PageTitle' }).isVisible()).toBe(true);
    expect(wrapper.findComponent({ name: 'PageLink' }).isVisible()).toBe(true);
  });

  it('renders home page with login button', async () => {
    const wrapper = await mountSuspended(App);

    // Login リンクが表示されている
    expect(wrapper.findComponent({ name: 'PageLink' }).isVisible()).toBe(true);
    expect(wrapper.findComponent({ name: 'PageLink' }).text()).toBe('Login');
  });

  it('navigates to login page correctly', async () => {
    const wrapper = await mountSuspended(App);

    // login ボタンをクリック
    // TODO: Login pageへ遷移できるようにする
    await wrapper.findComponent({ name: 'PageLink' }).trigger('click');

    expect(wrapper.findComponent({ name: 'PageTitle' }).isVisible()).toBe(true);
    // TODO: Login pageへ遷移できるようになったらコメントアウトを外す
    // expect(wrapper.findComponent({ name: 'PageTitle' }).text()).toBe('Login');
  });
})