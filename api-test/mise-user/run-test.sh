#!/bin/bash

# アプリケーションのDockerネットワーク
network_name='apps_default'
# テスト対象のAPIのbaseURL
base_url='http://mise-user:8080'

# Docker build
docker build -t stepci:latest .

# テスト実行
docker run --rm --network "$network_name" \
    stepci:latest /tests/workflow.yml -e base_url="$base_url"

