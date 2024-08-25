import { test, expect } from '@playwright/test';

test('renders the home page correctly', async ({ page }) => {
  // Home ページにアクセス
  await page.goto('/');

  //----- Header が表示されている ------
  // Home リンク
  await expect(page.getByRole('link', { name: 'Home'})).toBeVisible();

  // Login リンク
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Login' })).toBeVisible();

  //----- Body が表示されている ------
  // ページタイトル
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Home');

  // 未ログインメッセージ
  await expect(page.getByText('You are not logged in.')).toBeVisible();

  // Login ページへのリンク
  await expect(page.getByRole('main').getByRole('link', { name: 'Login' })).toBeVisible();

  //----- Footer が表示されている ------
  await expect(page.getByText('Sample Application')).toBeVisible();

});

test('navigate to the login page correctly', async ({ page }) => {
  // Home ページにアクセス
  await page.goto('/');

  // ログインボタンをクリック
  await page.getByRole('main').getByRole('link', { name: 'Login' }).click();

  // // ページ遷移を待機
  await page.waitForURL('**/login')

  // ページタイトルが Login になっていることを確認
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Login');
})

test('renders the login page correctly', async ({ page }) => {
  // ログインページにアクセス
  await page.goto('/login');

  //----- Header が表示されている ------
  // Home リンク
  await expect(page.getByRole('link', { name: 'Home'})).toBeVisible();

  // Login リンク
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Login' })).toBeVisible();

  //----- Body が表示されている ------
  // ページタイトル
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Login');

  // Login フォーム
  await expect(page.getByLabel('Email:')).toBeVisible();
  await expect(page.getByLabel('Password:')).toBeVisible();

  // sign-up ページへのリンク
  await expect(page.getByRole('main').getByRole('link')).toBeVisible();

  // Login ボタン
  await expect(page.getByRole('main').getByRole('button', { name: 'Login' })).toBeVisible();

  //----- Footer が表示されている ------
  await expect(page.getByText('Sample Application')).toBeVisible();
});

test('successfully logs in with valid credentials', async ({ page }) => {
  // ログインページにアクセス
  await page.goto('/login');


  console.log(await page.getByLabel('Email:').innerHTML())
  // フォームにデータを入力
  await page.getByLabel('Email:').fill('user@example.com');
  await page.getByLabel('Password:').fill('password');

  // ログインボタンをクリック
  await page.getByRole('button', { name: 'Login' }).click();

  // 認証が成功しているか確認 (例えば、ホームページにリダイレクトされたかどうか)
  await page.waitForURL('**/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Home');

  // ログイン後のユーザー情報が表示されているか確認
  await expect(page.getByText('ユーザ情報')).toBeVisible();
});
