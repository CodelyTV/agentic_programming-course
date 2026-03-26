import { IngredientType } from "./IngredientType";

export class Ingredient {
	constructor(
		public readonly name: string,
		public readonly type: IngredientType,
	) {}

	static main(name: string): Ingredient {
		return new Ingredient(name, IngredientType.Main);
	}

	static householdStaple(name: string): Ingredient {
		return new Ingredient(name, IngredientType.HouseholdStaple);
	}

	toPrimitives(): { name: string; type: string } {
		return {
			name: this.name,
			type: this.type,
		};
	}
}
