import { describe, it, expect, vi, afterEach } from 'vitest';
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime';
import BaseHeader from '@/components/BaseHeader.vue';

const { useUserMock } = vi.hoisted(() => {
  return {
    useUserMock: vi.fn(),
  }
})

mockNuxtImport('useUser', () => {
  return useUserMock;
})


const { navigateToMock } = vi.hoisted(() => {
  return {
    navigateToMock: vi.fn(),
  }
})

mockNuxtImport('navigateTo', () => {
  return navigateToMock;
})

describe('BaseHeader.vue', () => {
  afterEach(() => {
    useUserMock.mockReset();
  });
  
  it('renders login link when no user is logged in', async () => {
    // モックでユーザーがログインしていない状態を設定
    useUserMock.mockImplementation(() => {
      return {
        getCurrentUser: () => null
      };
    });

    const wrapper = await mountSuspended(BaseHeader);
    
    // ログインリンクが表示されることを確認
    expect(wrapper.find('a[href="/login"]').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(false);
  })

  it('renders logout button when a user is logged in', async () => {
    // モックでユーザーがログインしている状態を設定
    useUserMock.mockImplementation(() => {
      return {
        getCurrentUser: () => {
          return {
            value: { id: 1, name: 'Test User' }
          }
        }
      };
    });

    const wrapper = await mountSuspended(BaseHeader);

    // ログアウトボタンが表示されることを確認
    expect(wrapper.find('button').text()).toBe('Logout');
    expect(wrapper.find('a[href="/login"]').exists()).toBe(false);
  })

  it('calls logout method and navigates to home on logout', async () => {
    // モックでユーザーがログインしている状態を設定
    const logoutMock = vi.fn();
    useUserMock.mockImplementation(() => {
      return {
        getCurrentUser: () => {
          return {
            value: { id: 1, name: 'Test User' }
          }
        },
        logout: logoutMock
      };
    });

    const wrapper = await mountSuspended(BaseHeader);

    const logoutButton = wrapper.find('button');
    await logoutButton.trigger('click');

    // ログアウトメソッドが呼び出されることを確認
    expect(logoutMock).toHaveBeenCalled();

    // navigateTo("/") が呼び出されることを確認
    expect(navigateTo).toHaveBeenCalledWith('/');
  })
})
