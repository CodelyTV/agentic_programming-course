import { DishByIngredientsSuggester } from "../../../../../../src/contexts/dishes/dishes/application/suggest/DishByIngredientsSuggester";
import { CookedDishMother } from "../../../cooked-dishes/domain/CookedDishMother";
import { DishMother } from "../../domain/DishMother";
import { MockCookedDishesBySimilarIngredientsSearcher } from "../../infrastructure/MockCookedDishesBySimilarIngredientsSearcher";
import { MockDishByIngredientsSuggesterGateway } from "../../infrastructure/MockDishByIngredientsSuggesterGateway";

describe("DishByIngredientsSuggester should", () => {
	const gateway = new MockDishByIngredientsSuggesterGateway();
	const searcher = new MockCookedDishesBySimilarIngredientsSearcher();
	const suggester = new DishByIngredientsSuggester(
		gateway,
		searcher as unknown as import("../../../../../../src/contexts/dishes/cooked-dishes/application/search-by-similar-ingredients/CookedDishesBySimilarIngredientsSearcher").CookedDishesBySimilarIngredientsSearcher,
	);

	it("suggest a dish based on ingredients", async () => {
		const expectedDish = DishMother.create();
		const ingredientNames = ["tomato", "cheese", "basil"];

		searcher.shouldSearchReturn([]);
		gateway.shouldSuggestReturn(expectedDish);

		const result = await suggester.suggest(ingredientNames);

		expect(result).toEqual(expectedDish.toPrimitives());
	});

	it("exclude already cooked dishes with similar ingredients", async () => {
		const expectedDish = DishMother.create();
		const cookedDish = CookedDishMother.create();
		const ingredientNames = ["tomato", "cheese", "basil"];

		searcher.shouldSearchReturn([cookedDish.toPrimitives()]);
		gateway.shouldSuggestReturn(expectedDish);

		const result = await suggester.suggest(ingredientNames);

		expect(result).toEqual(expectedDish.toPrimitives());
	});

	it("filter empty ingredient names", async () => {
		const expectedDish = DishMother.create();
		const ingredientNames = ["tomato", "", "  ", "cheese"];

		searcher.shouldSearchReturn([]);
		gateway.shouldSuggestReturn(expectedDish);

		const result = await suggester.suggest(ingredientNames);

		expect(result).toEqual(expectedDish.toPrimitives());
	});

	it("trim ingredient names", async () => {
		const expectedDish = DishMother.create();
		const ingredientNames = ["  tomato  ", "cheese  ", "  basil"];

		searcher.shouldSearchReturn([]);
		gateway.shouldSuggestReturn(expectedDish);

		const result = await suggester.suggest(ingredientNames);

		expect(result).toEqual(expectedDish.toPrimitives());
	});
});
