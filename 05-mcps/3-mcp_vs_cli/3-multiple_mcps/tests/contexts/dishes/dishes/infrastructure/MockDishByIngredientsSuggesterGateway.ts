import { Dish } from "../../../../../src/contexts/dishes/dishes/domain/Dish";
import { DishByIngredientsSuggesterGateway } from "../../../../../src/contexts/dishes/dishes/domain/DishByIngredientsSuggesterGateway";
import { Ingredient } from "../../../../../src/contexts/shared/domain/Ingredient";

export class MockDishByIngredientsSuggesterGateway extends DishByIngredientsSuggesterGateway {
	private readonly mockSuggest = jest.fn();

	async suggest(
		_ingredients: Ingredient[],
		_excludedDishNames: string[],
	): Promise<Dish> {
		return this.mockSuggest() as Dish;
	}

	shouldSuggestReturn(dish: Dish): void {
		this.mockSuggest.mockReturnValue(dish);
	}
}
