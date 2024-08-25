# Makefile for Monorepo Project

# 定数
DOCKER_COMPOSE_FILE = apps/docker-compose.yml
FRONT_DIR = apps/front
BACKEND_DIR = apps/mise-user
DB_DIR = apps/db-user
API_TEST_DIR = api-test/mise-user

# デフォルトターゲット
.DEFAULT_GOAL := help

# ターゲットの定義

## ヘルプメッセージ
.PHONY: help
help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build                  Build both front-end and back-end applications"
	@echo "  up                     Start all services using Docker Compose"
	@echo "  down                   Stop all services using Docker Compose"
	@echo "  front-build            Build the front-end application"
	@echo "  front-dev              Start the front-end application in development mode"
	@echo "  front-test             Run front-end tests including unit tests with coverage and linting"
	@echo "  front-unittest         Run front-end unit tests"
	@echo "  front-unittest-coverage Run front-end unit tests with coverage reporting"
	@echo "  front-lint             Run front-end linter to check code style"
	@echo "  front-lint-fix         Fix linting issues in the front-end code"
	@echo "  backend-build          Build the back-end application (creates bootable JAR)"
	@echo "  backend-run            Run the back-end application"
	@echo "  backend-test           Run all back-end tests including unit tests, Checkstyle, PMD, and SpotBugs"
	@echo "  backend-unittest       Run back-end unit tests"
	@echo "  backend-checkstyle     Run back-end code style checks with Checkstyle"
	@echo "  backend-pmd            Run back-end static analysis with PMD (Programming Mistake Detector)"
	@echo "  backend-spotbugs       Run back-end static analysis with SpotBugs"
	@echo "  db-init                Initialize the database service using Docker Compose"
	@echo "  api-test               Run API tests for the mise-user application"

## アプリケーションのビルド
.PHONY: build
build: front-build backend-build

## Docker Compose を使用してサービスを起動
.PHONY: up
up: backend-build
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

## Docker Compose を使用してサービスを停止
.PHONY: down
down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

## フロントエンドのビルド
.PHONY: front-build
front-build:
	cd $(FRONT_DIR) && yarn install && yarn build

## フロントエンドの開発モードでの起動
.PHONY: front-dev
front-dev:
	cd $(FRONT_DIR) && yarn install && yarn dev

## フロントエンドのテスト実行
.PHONY: front-test
front-test: front-unittest-coverage front-lint

## フロントエンドのユニットテスト実行
.PHONY: front-unittest
front-unittest:
	cd $(FRONT_DIR) && yarn install && yarn test

## フロントエンドのユニットテストのカバレッジ実行
.PHONY: front-unittest-coverage
front-unittest-coverage:
	cd $(FRONT_DIR) && yarn install && yarn test:coverage

## フロントエンドのLinter実行
.PHONY: front-lint
front-lint:
	cd $(FRONT_DIR) && yarn install && yarn lint

## フロントエンドのLinterの修正を実行
.PHONY: front-lint-fix
front-lint-fix:
	cd $(FRONT_DIR) && yarn install && yarn lint:fix

## バックエンドのビルド
.PHONY: backend-build
backend-build:
	cd $(BACKEND_DIR) && ./gradlew bootJar

## バックエンドの実行
.PHONY: backend-run
backend-run:
	cd $(BACKEND_DIR) && ./gradlew bootRun

## バックエンドのテスト実行
.PHONY: backend-test
backend-test: backend-unittest backend-checkstyle  backend-pmd backend-spotbugs

## バックエンドのユニットテスト実行
.PHONY: backend-unittest
backend-unittest:
	cd $(BACKEND_DIR) && ./gradlew test

## バックエンドのLinter実行
.PHONY: backend-checkstyle
backend-checkstyle:
	cd $(BACKEND_DIR) && ./gradlew checkstyleMain checkstyleTest

## バックエンドの静的解析実行
.PHONY: backend-pmd
backend-pmd:
	cd $(BACKEND_DIR) && ./gradlew pmdMain pmdTest

## バックエンドの静的解析実行
.PHONY: backend-spotbugs
backend-spotbugs:
	cd $(BACKEND_DIR) && ./gradlew spotbugsMain spotbugsTest

## データベースの初期化
.PHONY: db-init
db-init:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d db-user

## API テストの実行
.PHONY: api-test
api-test: up
	cd $(API_TEST_DIR) && ./run-test.sh
