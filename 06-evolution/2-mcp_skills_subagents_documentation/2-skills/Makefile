.PHONY: checks
checks:
	npm run lint:fix
	npm run build
	npm run test

.PHONY: claude-symlinks
claude-symlinks:
	@bash etc/scripts/generate-claude-symlinks.sh

.PHONY: junie-symlinks
junie-symlinks:
	@bash etc/scripts/generate-junie-symlinks.sh

.PHONY: cursor-symlinks
cursor-symlinks:
	@bash etc/scripts/generate-cursor-symlinks.sh
