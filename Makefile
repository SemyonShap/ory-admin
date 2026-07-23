.PHONY: help install dev build lint typecheck start start-standalone docker-build docker-run clean all

IMAGE_NAME ?= ory-admin
PORT ?= 9000

help: ## Show this help message
	@awk '/^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, substr($$0, index($$0, "##")+3)}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Run development server
	PORT=$(PORT) npm run dev

build: ## Build production bundle
	npm run build

lint: ## Run ESLint
	npm run lint

typecheck: ## Run TypeScript type checking
	npm run typecheck

start: ## Start standalone server
	cp -r .next/static .next/standalone/.next/static
	PORT=$(PORT) HOSTNAME=localhost node --env-file=.env.local .next/standalone/server.js

docker-build: ## Build Docker image
	docker build -t $(IMAGE_NAME) .

docker-run: ## Run Docker container (port $(PORT))
	docker run -p $(PORT):$(PORT) $(IMAGE_NAME)

helm-lint: ## Lint Helm Chart
	helm lint ./charts/ory-admin --strict

helm-template: ## Template Helm Chart
	helm template my-release ./charts/ory-admin --debug

clean: ## Remove node_modules and .next
	rm -rf node_modules .next

all: install lint typecheck build ## Install, lint, typecheck and build