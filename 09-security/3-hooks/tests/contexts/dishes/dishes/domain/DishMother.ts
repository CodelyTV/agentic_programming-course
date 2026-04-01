import { faker } from "@faker-js/faker";

import {
	Dish,
	DishPrimitives,
} from "../../../../../src/contexts/dishes/dishes/domain/Dish";
import { Ingredient } from "../../../../../src/contexts/shared/domain/Ingredient";
import { IngredientType } from "../../../../../src/contexts/shared/domain/IngredientType";
import { IngredientMother } from "../../../shared/domain/IngredientMother";

export class DishMother {
	static create(params?: Partial<DishPrimitives>): Dish {
		const primitives: DishPrimitives = {
			name: faker.food.dish(),
			description: faker.food.description(),
			ingredients: [
				IngredientMother.main().toPrimitives(),
				IngredientMother.main().toPrimitives(),
				IngredientMother.householdStaple().toPrimitives(),
			],
			...params,
		};

		return new Dish(
			primitives.name,
			primitives.description,
			primitives.ingredients.map(
				(i) => new Ingredient(i.name, i.type as IngredientType),
			),
		);
	}
}
