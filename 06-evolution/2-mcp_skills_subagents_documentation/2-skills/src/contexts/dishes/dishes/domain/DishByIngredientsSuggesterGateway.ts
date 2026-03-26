import { Ingredient } from "../../../shared/domain/Ingredient";
import { Dish } from "../domain/Dish";

export abstract class DishByIngredientsSuggesterGateway {
	abstract suggest(
		ingredients: Ingredient[],
		excludedDishNames: string[],
	): Promise<Dish>;
}
