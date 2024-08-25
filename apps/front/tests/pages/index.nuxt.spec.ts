import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport, mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import IndexPage from '@/pages/index.vue';

// モック設定
const { currentUserMock } = vi.hoisted(() => {
  return {
    currentUserMock: vi.fn(),
  }
})
mockNuxtImport('useUser', () => {
  return () => {
    return {
      getCurrentUser: currentUserMock
    }
  };
});

describe('IndexPage.vue', () => {
  beforeEach(() => {
    currentUserMock.mockReset(); // 状態をリセット
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

  mockComponent('PageUser', {
    props: {
      user: Object,
    },
    setup(props) {
      return {
        user: {
          email: props.user?.email
        }
      };
    },
    template: `
      <div>
        <table>
          <tbody>
            <tr>
              <td>email</td>
              <td>{{ user.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>`,
  });

  it('displays page title as "Home"', async () => {
    const wrapper = await mountSuspended(IndexPage);

    // ページタイトルが表示されていることを確認
    const pageTitle = wrapper.find('h1');

    expect(pageTitle.exists()).toBe(true);
    expect(pageTitle.text()).toBe('Home');
  });

  it('displays "You are not logged in" message when no user is logged in', async () => {
    const wrapper = await mountSuspended(IndexPage);

    // ログインしていない場合のメッセージを確認
    expect(wrapper.text()).toContain('You are not logged in.');

    // ログインリンクが表示されていることを確認
    const loginLink = wrapper.find('a');
    expect(loginLink.exists()).toBe(true);
    expect(loginLink.attributes('href')).toBe('/login');
  });

  it('displays user information when a user is logged in', async () => {
    // ユーザ情報をモック
    const user = { id: '1', email: 'test@example.com', name: 'Test User' };
    currentUserMock.mockImplementation(() => {
      return user;
    })

    const wrapper = await mountSuspended(IndexPage);

    // ユーザー情報が表示されていることを確認
    expect(wrapper.text()).toContain('ユーザ情報');

    // すべての <td> 要素を取得
    const tds = wrapper.findAll('td');
    let emailFound = false;
    let emailValue = '';

    // <td> 要素をループして、'email' の次の <td> 要素を探す
    for (let i = 0; i < tds.length - 1; i++) {
      if (tds[i].text() === 'email') {
        emailFound = true;
        emailValue = tds[i + 1].text();
        break;
      }
    }

    // 'email' の次の <td> が見つかり、その内容が 'test@example.com' であることを確認
    expect(emailFound).toBe(true);
    expect(emailValue).toBe('test@example.com');
  });
});
