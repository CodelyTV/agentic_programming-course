# Useful commands

```bash
npm prep          # lint + build + test
docker compose up # start database
npm run dev       # local dev server (not Docker)
npm run lint:fix
npm run test
```

# Architecture

- Next.js 16, Hexagonal Architecture / DDD.
- Frontend in `src/app/`, API routes in `src/app/api/`.
- Backend in `src/contexts/`.

# Conventions

Detailed conventions with examples live in `docs/`. **Do NOT read all docs upfront.** When working on a task:

1. Identify which area applies: `docs/backend/`, `docs/database/`, `docs/testing/`, or `docs/` root.
2. Run `ls` only on that specific folder to discover relevant file names.
3. Read only the docs whose name matches what you need.
