// server/api/login.post.ts
import { H3Event, sendError } from 'h3';
import { defineEventHandler, readBody } from 'h3';
import { UserResponse } from '~/server/types/userResponse';
import { verify } from '~/server/utils/password';
import { isFetchError } from '~/server/utils/fetchError';
import { AuthError, isAuthError } from '~/server/utils/authError';

export default defineEventHandler(async (event: H3Event) => {
  const { apiBaseUrl } = useRuntimeConfig();

  const body = await readBody<{ email: string; password: string; }>(event);

  const { email, password } = body;

  try {
    const response = await $fetch<UserResponse>(`${apiBaseUrl}/user`, {
      method: 'POST',
      body: {
        email: email,
      },
    });

    // ユーザ認証
    const hasedPassword = response.data?.password || '';
    const verified = await verify(password, hasedPassword);
    if (!verified) {
      throw new AuthError('Bad credentials');
    }

    return {
      user: {
        id: response.data?.id,
        email: response.data?.email,
        name: response.data?.name,
      }
    }
  } catch (error) {
    console.error('Login API call failed:', error);
    // APIエラーの場合ステータスとメッセージを送信
    if (isFetchError(error)) {
      throw createError({ statusCode: error.response?.status || 500, statusMessage: error.response?._data?.message || 'Error message parsing failed' });
    } else if (isAuthError(error)) {
      throw createError({ statusCode: 401, statusMessage: error.message });
    } else {
      throw createError({ statusCode: 500, statusMessage: 'Login failed' });
    }
  }
})
