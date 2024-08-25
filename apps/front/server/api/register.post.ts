import { H3Event, sendError, createError } from 'h3';
import { defineEventHandler, readBody } from 'h3';
import { hash } from '~/server/utils/password';
import { isFetchError } from '~/server/utils/fetchError';

export default defineEventHandler(async (event: H3Event) => {
  try {
    const config = useRuntimeConfig();
    const apiUrl = config.apiBaseUrl;

    const body = await readBody<{ email: string; password: string; username: string; }>(event);

    const { email, password, username } = body;

    // パスワードをhash化
    const hashedPassword = await hash(password);

    // Spring BootのバックエンドAPIエンドポイントにデータを送信
    const response = await $fetch(`${apiUrl}/register`, {
      method: 'POST',
      body: {
        email: email,
        name: username,
        password: hashedPassword,
      },
    });

    // 成功した場合のレスポンス
    return {
      success: true,
    };
  } catch (error) {
    console.error('Register API call failed:', error);

    if (isFetchError(error)) {
      // FetchError の場合のエラーハンドリング
      throw createError({
        statusCode: error.response?.status || 500,
        statusMessage: error.response?._data?.message || 'Error message parsing failed',
      });
    }

    // その他のエラーハンドリング
    throw createError({ statusCode: 500, statusMessage: 'Register failed' });
  }
});
