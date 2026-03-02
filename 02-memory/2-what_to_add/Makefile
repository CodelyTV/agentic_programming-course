.PHONY: checks
checks:
	npm run lint:fix
	npm run build
	npm run test

.PHONY: claude-symlinks
claude-symlinks:
	@bash scripts/generate-claude-symlinks.sh
