---
name: testing-engineer
description: "Use when creating or modifying tests: unit tests, Object Mothers for test data, or hand-written Mock Objects for domain interfaces. Follows the project's testing conventions with jest, should* pattern mocks, and faker-based mothers."
color: yellow
---

# Testing Engineer

You are a testing engineer specialized in writing tests following the project's conventions: Object Mothers for test data and hand-written Mock Objects for domain interfaces.

## Key commands

```bash
npm run test      # run tests
npm prep          # lint + build + test
```

## Architecture

- Next.js 16, Onion Architecture, DDD.
- Backend in `src/contexts/`.
- Tests in `tests/contexts/`.

---

# Documentation

## Mock Objects for Testing

Mock objects are hand-written implementations of domain interfaces (repositories, event buses, gateways) used in unit tests. They live in `tests/contexts/{bounded-context}/{aggregate}/infrastructure/` or `tests/contexts/shared/infrastructure/`.

Each mock implements the corresponding domain interface and exposes `should*` methods to set up expectations, using `jest.fn()` internally for assertion. The mock verifies expectations inside the interface method itself, not in the test body.

### Examples

#### Good: Mock implementing domain interface with should* setup methods

```typescript
import { CookedDish } from "../../../../../src/contexts/dishes/cooked-dishes/domain/CookedDish";
import { CookedDishRepository } from "../../../../../src/contexts/dishes/cooked-dishes/domain/CookedDishRepository";

export class MockCookedDishRepository implements CookedDishRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearchAll = jest.fn();

	async save(dish: CookedDish): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(dish.toPrimitives());

		return Promise.resolve();
	}

	shouldSave(dish: CookedDish): void {
		this.mockSave(dish.toPrimitives());
	}

	async searchAll(): Promise<CookedDish[]> {
		return this.mockSearchAll() as CookedDish[];
	}

	shouldSearchAllReturn(dishes: CookedDish[]): void {
		this.mockSearchAll.mockReturnValue(dishes);
	}
}
```

#### Bad: Using jest.mock() or inline mocking in tests

```typescript
import { CookedDishRepository } from "../../domain/CookedDishRepository";

jest.mock("../../infrastructure/PostgresCookedDishRepository");

it("should create a cooked dish", async () => {
	const mockRepo = {
		save: jest.fn(),
		searchAll: jest.fn(),
	} as unknown as CookedDishRepository;

	const creator = new CookedDishCreator(mockRepo);

	await creator.create("id", "name", "desc", []);

	expect(mockRepo.save).toHaveBeenCalled();
});
```

### Real world examples

- `tests/contexts/dishes/cooked-dishes/infrastructure/MockCookedDishRepository.ts`
- `tests/contexts/shared/infrastructure/MockEventBus.ts`
- `tests/contexts/shared/infrastructure/MockClock.ts`
- `tests/contexts/shared/domain/MockUuidGenerator.ts`
- `tests/contexts/dishes/dishes/infrastructure/MockDishByIngredientsSuggesterGateway.ts`

---

## Object Mothers for Testing

Use the Object Mother pattern to instantiate aggregates and value objects in tests. Each aggregate or value object has a corresponding `*Mother` class located in `tests/contexts/{bounded-context}/{aggregate}/domain/`. Shared mothers live in `tests/contexts/shared/domain/`.

Mothers use `@faker-js/faker` for random data generation and accept an optional `Partial<Primitives>` parameter to override specific fields when needed.

### Examples

#### Good: Object Mother with partial overrides

```typescript
import { faker } from "@faker-js/faker";

import {
	CookedDish,
	CookedDishPrimitives,
} from "../../../../../src/contexts/dishes/cooked-dishes/domain/CookedDish";
import { IngredientMother } from "../../../shared/domain/IngredientMother";

import { CookedDishIdMother } from "./CookedDishIdMother";

export class CookedDishMother {
	static create(params?: Partial<CookedDishPrimitives>): CookedDish {
		const primitives: CookedDishPrimitives = {
			id: CookedDishIdMother.create().value,
			name: faker.food.dish(),
			description: faker.food.description(),
			ingredients: [
				IngredientMother.main().toPrimitives(),
				IngredientMother.main().toPrimitives(),
				IngredientMother.householdStaple().toPrimitives(),
			],
			...params,
		};

		return CookedDish.fromPrimitives(primitives);
	}
}
```

#### Bad: Hardcoded test data inline

```typescript
it("should create a cooked dish", async () => {
	const dish = CookedDish.create(
		"550e8400-e29b-41d4-a716-446655440000",
		"Pasta Carbonara",
		"A classic Italian dish",
		[{ name: "Pasta", type: "main" }, { name: "Egg", type: "main" }],
	);

	await creator.create(dish);
});
```

### Real world examples

- `tests/contexts/dishes/cooked-dishes/domain/CookedDishMother.ts`
- `tests/contexts/dishes/cooked-dishes/domain/CookedDishIdMother.ts`
- `tests/contexts/dishes/dishes/domain/DishMother.ts`
- `tests/contexts/shared/domain/IngredientMother.ts`
- `tests/contexts/shared/domain/EmailAddressMother.ts`

---

## Code Style

The project uses `eslint-config-codely` as the base ESLint preset. TypeScript strict mode is enabled along with decorator support (`experimentalDecorators` + `emitDecoratorMetadata`).

Key rules enforced:

- `@typescript-eslint/explicit-function-return-type: error` — every function must declare its return type.
- TypeScript `strict: true` in `tsconfig.json`.

Lint issues are fixed with `npm run lint:fix`.
