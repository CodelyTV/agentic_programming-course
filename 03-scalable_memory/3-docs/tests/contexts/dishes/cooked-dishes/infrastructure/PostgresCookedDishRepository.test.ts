import "reflect-metadata";

import { PostgresCookedDishRepository } from "../../../../../src/contexts/dishes/cooked-dishes/infrastructure/PostgresCookedDishRepository";
import { container } from "../../../../../src/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PostgresConnection } from "../../../../../src/contexts/shared/infrastructure/postgres/PostgresConnection";
import { CookedDishMother } from "../domain/CookedDishMother";

const connection = container.get(PostgresConnection);
const repository = container.get(PostgresCookedDishRepository);

describe("PostgresCookedDishRepository should", () => {
	beforeEach(async () => {
		await connection.truncateAll();
	});

	afterAll(async () => {
		await connection.end();
	});

	it("save a cooked dish", async () => {
		const dish = CookedDishMother.create();

		await repository.save(dish);
	});

	it("search all cooked dishes", async () => {
		const dish1 = CookedDishMother.create();
		const dish2 = CookedDishMother.create();

		await repository.save(dish1);
		await repository.save(dish2);

		const result = await repository.searchAll();

		expect(result).toHaveLength(2);
		expect(result.map((d) => d.toPrimitives())).toEqual(
			expect.arrayContaining([
				dish1.toPrimitives(),
				dish2.toPrimitives(),
			]),
		);
	});

	it("return empty array when no dishes exist", async () => {
		const result = await repository.searchAll();

		expect(result).toEqual([]);
	});

	it("search dishes by similar ingredients sorted by similarity", async () => {
		const dish1 = CookedDishMother.create({
			name: "Pasta Carbonara",
			ingredients: [
				{ name: "pasta", type: "main" },
				{ name: "bacon", type: "main" },
				{ name: "egg", type: "main" },
			],
		});
		const dish2 = CookedDishMother.create({
			name: "Caesar Salad",
			ingredients: [
				{ name: "lettuce", type: "main" },
				{ name: "chicken", type: "main" },
				{ name: "parmesan", type: "main" },
			],
		});

		await repository.save(dish1);
		await repository.save(dish2);

		const result = await repository.searchByRecentSimilarIngredients([
			"pasta",
			"egg",
		]);

		expect(result).toEqual([dish1, dish2]);
	});

	it("return empty array when searching by ingredients with no dishes", async () => {
		const result = await repository.searchByRecentSimilarIngredients([
			"tomato",
		]);

		expect(result).toEqual([]);
	});

	it("exclude dishes cooked more than a month ago", async () => {
		const recentDish = CookedDishMother.create({
			name: "Fresh Pasta",
			ingredients: [
				{ name: "pasta", type: "main" },
				{ name: "tomato", type: "main" },
			],
		});
		const oldDish = CookedDishMother.create({
			name: "Old Pasta",
			ingredients: [
				{ name: "pasta", type: "main" },
				{ name: "basil", type: "main" },
			],
		});

		await repository.save(recentDish);
		await repository.save(oldDish);

		await connection.sql`
			UPDATE dishes.cooked_dishes
			SET cooked_at = NOW() - INTERVAL '2 months'
			WHERE id = ${oldDish.id.value}
		`;

		const result = await repository.searchByRecentSimilarIngredients([
			"pasta",
		]);

		expect(result).toEqual([recentDish]);
	});
});
