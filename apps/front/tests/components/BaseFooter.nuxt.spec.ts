import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BaseFooter from '@/components/BaseFooter.vue'

describe('BaseFooter.vue', () => {
  it('renders footer with correct text', async () => {
    const wrapper = await mountSuspended(BaseFooter);
    expect(wrapper.find('footer').exists()).toBe(true);
    expect(wrapper.find('footer p').text()).toBe('Sample Application');
  })
})