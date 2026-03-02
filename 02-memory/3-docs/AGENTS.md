# Useful commands

```bash
make checks       # lint + build + test
docker compose up # start database
npm run dev       # local dev server (not Docker)
npm run lint:fix
npm run test
```

# Architecture

- Next.js 16, Hexagonal Architecture / DDD.
- Frontend: `src/app/`. API routes: `src/app/api/`. Backend: `src/contexts/`.
- Layers: Domain → Application (one use case per class) → Infrastructure.
- DI: DIOD with `@Service()`, container at `src/contexts/shared/infrastructure/dependency-injection/diod.config.ts`.
- API routes require `import "reflect-metadata"` at top

# DB
- PostgreSQL + pgvector.
- Embeddings `vector(1024)`.

# Testing

- Always use object mothers to instantiate aggregates in tests (`tests/contexts/*/domain/`)
- Mock objects are implementations of domain interfaces (e.g. `MockEventBus` implements `EventBus`) in `tests/contexts/*/infrastructure/`

# Code Style

- `eslint-config-codely` preset
- `explicit-function-return-type: error`
- TypeScript strict mode with decorators
