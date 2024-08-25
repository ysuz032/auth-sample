import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { H3Event } from 'h3';
import { FetchError } from 'ofetch';
import loginHandler from '~/server/api/login.post';

// モジュールのモック
const { verifyMock } = vi.hoisted(() => {
  return {
    verifyMock: vi.fn()
  }
})
vi.mock('~/server/utils/password', () => {
  return {
    verify: verifyMock
  }
})

const { apiBaseUrl } = useRuntimeConfig();

describe('login.post', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('logs in a user successfully', async () => {
    // モックデータ
    const user = { id: '1', email: 'test@example.Íom', name: 'Test User', password: 'hashed_password' };

    // `/user` エンドポイントをモック
    registerEndpoint(`${apiBaseUrl}/user`, {
      handler: () => ({ data: user }),
      method: 'POST',
    });

    // パスワードの検証モック
    verifyMock.mockImplementation(() => true);

    // テスト用のリクエストイベントを設定
    const loginPayload = { email: 'test@example.com', password: 'password' };
    const event = {
      method: 'POST',
      node: {
        req: {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(loginPayload),
        },
      },
    } as unknown as H3Event;

    // ハンドラーを呼び出し
    const result = await loginHandler(event);
    // 結果の検証
    expect(result).toEqual({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  });

  it('returns 401 if password is incorrect', async () => {
    // モックデータ
    const user = { id: '1', email: 'test@example.com', name: 'Test User', password: 'hashed_password' };

    // `/user` エンドポイントをモック
    registerEndpoint(`${apiBaseUrl}/user`, {
      handler: () => ({ data: user }),
      method: 'POST',
    });

    // パスワードの検証モック
    verifyMock.mockImplementation(() => false);

    // ハンドラーを呼び出す
    const loginPayload = { email: 'test@example.com', password: 'wrongpassword' };
    const event = {
      method: 'POST',
      node: {
        req: {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(loginPayload),
        },
      },
    } as unknown as H3Event;

    try {
      await loginHandler(event);
    } catch (error: any) {
      expect(error?.statusCode).toBe(401);
      expect(error?.statusMessage).toBe('Bad credentials');
    }
  });

  it('returns 500 if $fetch throws an error', async () => {

    // $fetch をモックしてエラーをスロー
    vi.spyOn(global, '$fetch')
      .mockImplementation(async () => {
        const fetchError = new FetchError('Fetch failed');
        // login.post.tsで参照する部分のみモックする
        Object.defineProperty(fetchError, 'response', {
          get() {
            return {
              status: 500,
              _data: {
                message: 'Fetch failed'
              }
            };
          },
        });
        throw fetchError;
      });

    // ハンドラーを呼び出す
    const loginPayload = { email: 'test@example.com', password: 'password' };
    const event = {
      method: 'POST',
      node: {
        req: {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(loginPayload),
        },
      },
    } as unknown as H3Event;

    try {
      await loginHandler(event);
    } catch (error: any) {
      expect(error?.statusCode).toBe(500);
      expect(error?.statusMessage).toBe('Fetch failed');
    }
  });

  it('returns 500 if an unexpected error occurs', async () => {

    // $fetch をモックしてエラーをスロー
    vi.spyOn(global, '$fetch')
      .mockImplementation(async () => {
        throw new Error('fetch failed')
      });

    // ハンドラーを呼び出す
    const loginPayload = { email: 'test@example.com', password: 'password' };
    const event = {
      method: 'POST',
      node: {
        req: {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(loginPayload),
        },
      },
    } as unknown as H3Event;

    try {
      await loginHandler(event);
    } catch (error: any) {
      expect(error.statusCode).toBe(500);
      expect(error.statusMessage).toBe('Login failed');
    }
  });
});
