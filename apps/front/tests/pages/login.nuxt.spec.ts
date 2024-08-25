import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport, mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import LoginPage from '@/pages/login.vue';

const { loginMock } = vi.hoisted(() => {
  return {
    loginMock: vi.fn(),
  }
});

const { navigateToMock } = vi.hoisted(() => {
  return {
    navigateToMock: vi.fn(),
  }
});

// モック設定
mockNuxtImport('useUser', () => {
  return () => {
    return {
      login: loginMock,
    }
  };
});

mockNuxtImport('navigateTo', () => navigateToMock);

describe('LoginPage.vue', () => {
  beforeEach(() => {
    loginMock.mockReset();
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

  mockComponent('PageLink', {
    props: {
      to: String,
    },
    setup(props) {
      return {
        to: props.to
      };
    },
    template: '<a :href="to"><slot /></a>',
  });

  it('displays page title as "Login"', async () => {
    const wrapper = await mountSuspended(LoginPage);

    // ページタイトルが表示されていることを確認
    const pageTitle = wrapper.find('h1');
    expect(pageTitle.exists()).toBe(true);
    expect(pageTitle.text()).toBe('Login');
  });

  it('has input fields for email and password', async () => {
    const wrapper = await mountSuspended(LoginPage);

    // メールとパスワードの入力フィールドが存在することを確認
    const emailInput = wrapper.find('input#email');
    const passwordInput = wrapper.find('input#password');

    expect(emailInput.exists()).toBe(true);
    expect(passwordInput.exists()).toBe(true);
  });

  it('navigates to register page on link click', async () => {
    const wrapper = await mountSuspended(LoginPage);

    // 登録リンクをクリック
    const registerLink = wrapper.find('a[href="/register"]');
    expect(registerLink.exists()).toBe(true);
  });

  it('calls login method on form submit', async () => {
    // login関数をモック
    const user = {
      id: '1',
      email: 'test@example.com',
      name: 'testuser',
    }
    loginMock.mockResolvedValue({ data: { user: user } });

    const wrapper = await mountSuspended(LoginPage);

    // フォームにデータを入力
    const emailInput = wrapper.find('input#email');
    const passwordInput = wrapper.find('input#password');
    await emailInput.setValue(user.email);
    await passwordInput.setValue('password');

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent');

    // ログイン関数が呼び出されることを確認
    expect(loginMock).toHaveBeenCalledWith(user.email, 'password');
    expect(navigateToMock).toHaveBeenCalledWith('/');
  });

  it('displays error message on login failure', async () => {
    // login関数をモックして、特定のエラーをスロー
    loginMock.mockImplementationOnce(() => {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
    });

    const wrapper = await mountSuspended(LoginPage);

    // フォームにデータを入力
    const emailInput = wrapper.find('input#email');
    const passwordInput = wrapper.find('input#password');
    await emailInput.setValue('wronguser@example.com');
    await passwordInput.setValue('wrongpassword');

    // フォームを送信
    await wrapper.find('form').trigger('submit.prevent');

    // エラーメッセージが表示されることを確認
    const errorMessage = wrapper.find('p.text-red-400');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('Invalid credentials');
  });
});
