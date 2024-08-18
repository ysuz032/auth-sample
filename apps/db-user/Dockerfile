# ベースイメージとして公式のPostgreSQLイメージを使用
FROM postgres:latest

# 初期化スクリプトをコンテナ内にコピー
COPY init.sql /docker-entrypoint-initdb.d/

# デフォルトのポート
EXPOSE 5432