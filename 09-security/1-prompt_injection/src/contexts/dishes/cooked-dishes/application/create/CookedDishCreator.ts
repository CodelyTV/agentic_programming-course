import { Service } from "diod";

import { CookedDish } from "../../domain/CookedDish";
import { CookedDishRepository } from "../../domain/CookedDishRepository";

@Service()
export class CookedDishCreator {
	constructor(private readonly repository: CookedDishRepository) {}

	async create(
		id: string,
		name: string,
		description: string,
		ingredients: { name: string; type: string }[],
	): Promise<void> {
		const dish = CookedDish.create(id, name, description, ingredients);

		await this.repository.save(dish);
	}
}
