import { CookedDishesBySimilarIngredientsSearcher } from "../../../../../../src/contexts/dishes/cooked-dishes/application/search-by-similar-ingredients/CookedDishesBySimilarIngredientsSearcher";
import { CookedDishMother } from "../../domain/CookedDishMother";
import { MockCookedDishRepository } from "../../infrastructure/MockCookedDishRepository";

describe("CookedDishesByIngredientsSearcher should", () => {
	const repository = new MockCookedDishRepository();
	const searcher = new CookedDishesBySimilarIngredientsSearcher(repository);

	it("return dishes matching the given ingredients", async () => {
		const dishes = [CookedDishMother.create(), CookedDishMother.create()];

		repository.shouldSearchByRecentSimilarIngredientsReturn(dishes);

		const result = await searcher.search(["tomato", "cheese"]);

		expect(result).toEqual(dishes.map((dish) => dish.toPrimitives()));
	});

	it("return empty array when no ingredients provided", async () => {
		const result = await searcher.search([]);

		expect(result).toEqual([]);
	});

	it("return empty array when no dishes match", async () => {
		repository.shouldSearchByRecentSimilarIngredientsReturn([]);

		const result = await searcher.search(["exotic-ingredient"]);

		expect(result).toEqual([]);
	});
});
