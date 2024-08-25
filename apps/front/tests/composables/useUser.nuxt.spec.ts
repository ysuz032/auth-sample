import { describe, it, expect, vi, afterEach } from 'vitest';
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime';
import { useUser } from '@/composables/useUser';

describe('useUser', () => {
  it('logs in a user and sets currentUser', async () => {
    // モックデータ
    const user = { id: 1, name: 'Test User' };

    // `/api/login` エンドポイントをモック
    registerEndpoint('/api/login', {
      handler: () => ({ user: user }),
      method: 'POST',
    });

    const { login } = useUser();
    const result = await login('test@example.com', 'password');

    expect(result.value).toEqual(user);
  });

  it('logs out a user and clears currentUser', async () => {
    // モックデータ
    const user = null;

    // `/api/logout` エンドポイントをモック
    registerEndpoint('/api/logout', {
      handler: () => ({ user: user }),
      method: 'POST'
    });

    const { logout, getCurrentUser } = useUser();
    await logout();
    const currentUser = getCurrentUser();

    expect(currentUser.value).toBe(null);
  });

  it('registers a new user', async () => {
    // `/api/register` エンドポイントをモック
    registerEndpoint('/api/register', {
      handler: () => ({}),
      method: 'POST'
    });

    const { registerUser, getCurrentUser } = useUser();
    await registerUser('newuser', 'newuser@example.com', 'password123');
    const currentUser = getCurrentUser();

    expect(currentUser.value).toBe(null)
  });
});
