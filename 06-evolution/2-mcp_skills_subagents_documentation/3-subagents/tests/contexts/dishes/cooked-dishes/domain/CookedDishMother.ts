import { faker } from "@faker-js/faker";

import {
	CookedDish,
	CookedDishPrimitives,
} from "../../../../../src/contexts/dishes/cooked-dishes/domain/CookedDish";
import { IngredientMother } from "../../../shared/domain/IngredientMother";

import { CookedDishIdMother } from "./CookedDishIdMother";

export class CookedDishMother {
	static create(params?: Partial<CookedDishPrimitives>): CookedDish {
		const primitives: CookedDishPrimitives = {
			id: CookedDishIdMother.create().value,
			name: faker.food.dish(),
			description: faker.food.description(),
			ingredients: [
				IngredientMother.main().toPrimitives(),
				IngredientMother.main().toPrimitives(),
				IngredientMother.householdStaple().toPrimitives(),
			],
			...params,
		};

		return CookedDish.fromPrimitives(primitives);
	}
}
