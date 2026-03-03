import { Service } from "diod";

import { CookedDishPrimitives } from "../../domain/CookedDish";
import { CookedDishId } from "../../domain/CookedDishId";
import { CookedDishRepository } from "../../domain/CookedDishRepository";

@Service()
export class CookedDishByIdSearcher {
	constructor(private readonly repository: CookedDishRepository) {}

	async search(id: string): Promise<CookedDishPrimitives | null> {
		const dish = await this.repository.searchById(new CookedDishId(id));

		return dish?.toPrimitives() ?? null;
	}
}
