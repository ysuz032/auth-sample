# -------
# builder
# -------
# ベースイメージを指定
FROM node:22 AS builder

# 作業ディレクトリを指定
WORKDIR /app

# ビルド時の引数を定義
ARG API_BASE_URL

# 依存関係のインストール
COPY package.json yarn.lock ./
RUN yarn install

# アプリケーションのソースコードをコピー
COPY . .

# ビルド
RUN API_BASE_URL=${API_BASE_URL} yarn build

# -------
# runtime
# -------
# ベースイメージを指定
FROM node:22 AS runtime

# 作業ディレクトリを指定
WORKDIR /app

COPY --from=builder /app/.output .output

# アプリケーションの実行
CMD ["node", ".output/server/index.mjs"]
