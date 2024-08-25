import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import PageUser from '@/components/PageUser.vue';

describe('PageUser.vue', () => {
  it('renders user information correctly', async () => {
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
    };

    const wrapper = await mountSuspended(PageUser, {
      props: {
        user: user,
      },
    });

    // テーブルの行が3つあることを確認
    const rows = wrapper.findAll('tr');
    expect(rows.length).toBe(3);

    // 各行の内容を確認
    expect(rows[0].find('td:first-child').text()).toBe('name');
    expect(rows[0].find('td:last-child').text()).toBe('John Doe');

    expect(rows[1].find('td:first-child').text()).toBe('email');
    expect(rows[1].find('td:last-child').text()).toBe('john.doe@example.com');

    expect(rows[2].find('td:first-child').text()).toBe('role');
    expect(rows[2].find('td:last-child').text()).toBe('admin');
  });

  it('renders no rows if user is null', async () => {
    const wrapper = await mountSuspended(PageUser, {
      props: {
        user: null,
      },
    });

    // テーブルの行がないことを確認
    const rows = wrapper.findAll('tr');
    expect(rows.length).toBe(0);
  });
});
