#!/bin/bash

# アプリケーションのDockerネットワーク
network_name='apps_default'
# テスト対象のAPIのbaseURL
base_url='http://mise-user:8080'

# テスト実行
docker run --rm --network "$network_name" -v "$(pwd)"/tests:/tests ghcr.io/stepci/stepci /tests/workflow.yml -e base_url="$base_url"