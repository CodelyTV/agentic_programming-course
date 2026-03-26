import { Service } from "diod";

import { CookedDishPrimitives } from "../../domain/CookedDish";
import { CookedDishRepository } from "../../domain/CookedDishRepository";

@Service()
export class CookedDishesBySimilarIngredientsSearcher {
	constructor(private readonly repository: CookedDishRepository) {}

	async search(ingredientNames: string[]): Promise<CookedDishPrimitives[]> {
		if (ingredientNames.length === 0) {
			return [];
		}

		const dishes =
			await this.repository.searchByRecentSimilarIngredients(
				ingredientNames,
			);

		return dishes.map((dish) => dish.toPrimitives());
	}
}
