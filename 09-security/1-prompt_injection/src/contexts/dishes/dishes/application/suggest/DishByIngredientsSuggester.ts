import { Service } from "diod";

import { Ingredient } from "../../../../shared/domain/Ingredient";
import { CookedDishesBySimilarIngredientsSearcher } from "../../../cooked-dishes/application/search-by-similar-ingredients/CookedDishesBySimilarIngredientsSearcher";
import { DishPrimitives } from "../../domain/Dish";
import { DishByIngredientsSuggesterGateway } from "../../domain/DishByIngredientsSuggesterGateway";

@Service()
export class DishByIngredientsSuggester {
	constructor(
		private readonly gateway: DishByIngredientsSuggesterGateway,
		private readonly cookedDishesBySimilarIngredientsSearcher: CookedDishesBySimilarIngredientsSearcher,
	) {}

	async suggest(ingredientNames: string[]): Promise<DishPrimitives> {
		const ingredients = ingredientNames
			.filter((name) => name.trim() !== "")
			.map((name) => Ingredient.main(name.trim()));

		const excludedDishNames = await this.excludedDishNames(ingredients);

		const dish = await this.gateway.suggest(ingredients, excludedDishNames);

		return dish.toPrimitives();
	}

	private async excludedDishNames(
		ingredients: Ingredient[],
	): Promise<string[]> {
		const cookedDishes =
			await this.cookedDishesBySimilarIngredientsSearcher.search(
				ingredients.map((ingredient) => ingredient.name),
			);

		return cookedDishes.map((dish) => dish.name);
	}
}
