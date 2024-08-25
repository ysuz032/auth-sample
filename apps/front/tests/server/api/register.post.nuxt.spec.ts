import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { H3Event } from 'h3';
import { FetchError } from 'ofetch';
import registerHandler from '~/server/api/register.post';

// モジュールのモック
const { hashMock } = vi.hoisted(() => {
  return {
    hashMock: vi.fn(),
  };
});
vi.mock('~/server/utils/password', () => {
  return {
    hash: hashMock,
  }
});

const { apiBaseUrl } = useRuntimeConfig();

describe('register.post', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a user successfully', async () => {
    // モックデータ
    const hashedPassword = 'hashed_password';
    const user = { email: 'test@example.com', name: 'Test User', password: hashedPassword };

    // パスワードのハッシュ化モック
    hashMock.mockResolvedValue(hashedPassword);

    // `/register` エンドポイントをモック
    registerEndpoint(`${apiBaseUrl}/register`, {
      handler: () => ({ success: true }),
      method: 'POST',
    });

    // テスト用のリクエストイベントを設定
    const registerPayload = { email: 'test@example.com', password: 'password123', username: 'Test User' };
    const event = {
      method: 'POST',
      node: {
        req: {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(registerPayload),
        },
      },
    } as unknown as H3Event;

    // ハンドラーを呼び出し
    const result = await registerHandler(event);

    // 結果の検証
    expect(result).toEqual({ success: true });
  });

  it('returns 500 if $fetch throws an error', async () => {
    // $fetch をモックしてエラーをスロー
    vi.spyOn(global, '$fetch').mockImplementation(async () => {
      const fetchError = new FetchError('Fetch failed');
      // register.post.tsで参照する部分のみモックする
      Object.defineProperty(fetchError, 'response', {
        get() {
          return {
            status: 500,
            _data: {
              message: 'Fetch failed',
            },
          };
        },
      });
      throw fetchError;
    });

    // テスト用のリクエストイベントを設定
    const registerPayload = { email: 'test@example.com', password: 'password123', username: 'Test User' };
    const event = {
      method: 'POST',
      node: {
        req: {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(registerPayload),
        },
      },
    } as unknown as H3Event;

    try {
      await registerHandler(event);
    } catch (error: any) {
      expect(error.statusCode).toBe(500);
      expect(error.statusMessage).toBe('Fetch failed');
    }
  });

  it('returns 500 if an unexpected error occurs', async () => {
    // $fetch をモックしてエラーをスロー
    vi.spyOn(global, '$fetch').mockImplementation(async () => {
      throw new Error('Unexpected error');
    });

    // テスト用のリクエストイベントを設定
    const registerPayload = { email: 'test@example.com', password: 'password123', username: 'Test User' };
    const event = {
      method: 'POST',
      node: {
        req: {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(registerPayload),
        },
      },
    } as unknown as H3Event;

    try {
      await registerHandler(event);
    } catch (error: any) {
      expect(error.statusCode).toBe(500);
      expect(error.statusMessage).toBe('Register failed');
    }
  });
});
