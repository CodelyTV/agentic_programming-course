import { CookedDish } from "./CookedDish";
import { CookedDishId } from "./CookedDishId";

export abstract class CookedDishRepository {
	abstract save(dish: CookedDish): Promise<void>;

	abstract searchById(id: CookedDishId): Promise<CookedDish | null>;

	abstract searchAll(): Promise<CookedDish[]>;

	abstract searchByRecentSimilarIngredients(
		ingredientNames: string[],
	): Promise<CookedDish[]>;
}
