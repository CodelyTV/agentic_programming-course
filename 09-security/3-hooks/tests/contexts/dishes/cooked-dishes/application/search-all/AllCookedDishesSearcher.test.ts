import { AllCookedDishesSearcher } from "../../../../../../src/contexts/dishes/cooked-dishes/application/search-all/AllCookedDishesSearcher";
import { CookedDishMother } from "../../domain/CookedDishMother";
import { MockCookedDishRepository } from "../../infrastructure/MockCookedDishRepository";

describe("AllCookedDishesSearcher should", () => {
	const repository = new MockCookedDishRepository();
	const searcher = new AllCookedDishesSearcher(repository);

	it("return all cooked dishes", async () => {
		const dishes = [
			CookedDishMother.create(),
			CookedDishMother.create(),
			CookedDishMother.create(),
		];

		repository.shouldSearchAllReturn(dishes);

		const result = await searcher.searchAll();

		expect(result).toEqual(dishes.map((dish) => dish.toPrimitives()));
	});

	it("return empty array when no dishes exist", async () => {
		repository.shouldSearchAllReturn([]);

		const result = await searcher.searchAll();

		expect(result).toEqual([]);
	});
});
