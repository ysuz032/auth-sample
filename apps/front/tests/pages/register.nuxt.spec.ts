import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport, mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import RegisterPage from '@/pages/register.vue';

// モック設定
const { registerUserMock } = vi.hoisted(() => {
  return {
    registerUserMock: vi.fn(),
  }
});

const { navigateToMock } = vi.hoisted(() => {
  return {
    navigateToMock: vi.fn(),
  }
});

// `useUser`と`navigateTo`をモック
mockNuxtImport('useUser', () => {
  return () => {
    return {
      registerUser: registerUserMock,
    }
  };
});

mockNuxtImport('navigateTo', () => navigateToMock);

describe('RegisterPage.vue', () => {
  beforeEach(() => {
    registerUserMock.mockReset();
    navigateToMock.mockReset();
  });

  // モックするコンポーネントの設定
  mockComponent('PageTitle', {
    props: {
      title: String,
    },
    setup(props) {
      return {
        title: props.title
      };
    },
    template: `<h1>{{ title }}</h1>`,
  });

  it('displays page title as "Register"', async () => {
    const wrapper = await mountSuspended(RegisterPage);

    // ページタイトルが表示されていることを確認
    const pageTitle = wrapper.find('h1');
    expect(pageTitle.exists()).toBe(true);
    expect(pageTitle.text()).toBe('Register');
  });

  it('has input fields for username, email, and password', async () => {
    const wrapper = await mountSuspended(RegisterPage);

    // ユーザー名、メール、パスワードの入力フィールドが存在することを確認
    const usernameInput = wrapper.find('input#username');
    const emailInput = wrapper.find('input#email');
    const passwordInput = wrapper.find('input#password');

    expect(usernameInput.exists()).toBe(true);
    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
  });

  it('calls registerUser method on form submit', async () => {
    const wrapper = await mountSuspended(RegisterPage);

    // フォームにデータを入力
    const usernameInput = wrapper.find('input#username');
    const emailInput = wrapper.find('input#email');
    const passwordInput = wrapper.find('input#password');
    await usernameInput.setValue('testuser');
    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password');

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent');

    // registerUser関数が呼び出されることを確認
    expect(registerUserMock).toHaveBeenCalledWith('testuser', 'test@example.com', 'password');
    expect(navigateToMock).toHaveBeenCalledWith('/');
  });

  it('displays error message on registration failure', async () => {
    // registerUser関数をモックして、特定のエラーをスロー
    registerUserMock.mockImplementationOnce(() => {
      throw createError({ statusCode: 409, statusMessage: 'Registration failed' });
    });

    const wrapper = await mountSuspended(RegisterPage);

    // フォームにデータを入力
    const usernameInput = wrapper.find('input#username');
    const emailInput = wrapper.find('input#email');
    const passwordInput = wrapper.find('input#password');
    await usernameInput.setValue('testuser');
    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password');

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent');

    // エラーメッセージが表示されることを確認
    const errorMessage = wrapper.find('p.text-red-400');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('Registration failed');
  });
});
