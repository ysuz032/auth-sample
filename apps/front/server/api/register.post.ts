// server/api/register.post.ts
import { H3Event, sendError } from 'h3'
import { defineEventHandler, readBody } from 'h3'
import { hash } from '~~/utils/password';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const apiUrl = config.apiBaseUrl;
  
  const body = await readBody<{ email: string; password: string; username: string;}>(event);

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

  return response;
});
