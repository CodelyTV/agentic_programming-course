import { Ingredient } from "../../../shared/domain/Ingredient";

export interface DishPrimitives {
	name: string;
	description: string;
	ingredients: { name: string; type: string }[];
}

export class Dish {
	constructor(
		readonly name: string,
		readonly description: string,
		readonly ingredients: Ingredient[],
	) {}

	toPrimitives(): DishPrimitives {
		return {
			name: this.name,
			description: this.description,
			ingredients: this.ingredients.map((ingredient) =>
				ingredient.toPrimitives(),
			),
		};
	}
}
