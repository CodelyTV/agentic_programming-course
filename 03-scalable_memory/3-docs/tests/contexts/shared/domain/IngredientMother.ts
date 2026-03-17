import { faker } from "@faker-js/faker";

import { Ingredient } from "../../../../src/contexts/shared/domain/Ingredient";
import { IngredientType } from "../../../../src/contexts/shared/domain/IngredientType";

export class IngredientMother {
	static create(params?: {
		name?: string;
		type?: IngredientType;
	}): Ingredient {
		return new Ingredient(
			params?.name ?? faker.food.ingredient(),
			params?.type ??
				faker.helpers.arrayElement([
					IngredientType.Main,
					IngredientType.HouseholdStaple,
				]),
		);
	}

	static main(name?: string): Ingredient {
		return Ingredient.main(name ?? faker.food.ingredient());
	}

	static householdStaple(name?: string): Ingredient {
		return Ingredient.householdStaple(
			name ??
				faker.helpers.arrayElement(["salt", "pepper", "water", "oil"]),
		);
	}

	static createList(count: number): Ingredient[] {
		return Array.from({ length: count }, () => this.create());
	}
}
