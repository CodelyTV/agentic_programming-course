import { Service } from "diod";

import { CookedDishPrimitives } from "../../domain/CookedDish";
import { CookedDishRepository } from "../../domain/CookedDishRepository";

@Service()
export class AllCookedDishesSearcher {
	constructor(private readonly repository: CookedDishRepository) {}

	async searchAll(): Promise<CookedDishPrimitives[]> {
		const dishes = await this.repository.searchAll();

		return dishes.map((dish) => dish.toPrimitives());
	}
}
