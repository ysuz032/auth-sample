import { describe, it, expect } from 'vitest';
import { H3Event } from 'h3';
import logoutHandler from '~/server/api/logout.post';

describe('logout.post', () => {
  it('returns user: null on logout', async () => {
    // テスト用のリクエストイベントを設定
    const event = {
      method: 'POST',
      node: {
        req: {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({}),
        },
      },
    } as unknown as H3Event;

    // `/api/logout` エンドポイントを呼び出し
    const result = await logoutHandler(event);

    // 結果の検証
    expect(result).toEqual({
      user: null,
    });
  });
});
