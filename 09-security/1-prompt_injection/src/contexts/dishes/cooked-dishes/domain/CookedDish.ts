import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Ingredient } from "../../../shared/domain/Ingredient";
import { IngredientType } from "../../../shared/domain/IngredientType";

import { CookedDishId } from "./CookedDishId";

export interface CookedDishPrimitives {
	id: string;
	name: string;
	description: string;
	ingredients: { name: string; type: string }[];
}

export class CookedDish extends AggregateRoot {
	constructor(
		readonly id: CookedDishId,
		readonly name: string,
		readonly description: string,
		readonly ingredients: Ingredient[],
	) {
		super();
	}

	static create(
		id: string,
		name: string,
		description: string,
		ingredients: { name: string; type: string }[],
	): CookedDish {
		return new CookedDish(
			new CookedDishId(id),
			name,
			description,
			ingredients.map(
				(ingredient) =>
					new Ingredient(
						ingredient.name,
						ingredient.type as IngredientType,
					),
			),
		);
	}

	static fromPrimitives(primitives: CookedDishPrimitives): CookedDish {
		return new CookedDish(
			new CookedDishId(primitives.id),
			primitives.name,
			primitives.description,
			primitives.ingredients.map(
				(ingredient) =>
					new Ingredient(
						ingredient.name,
						ingredient.type as IngredientType,
					),
			),
		);
	}

	toPrimitives(): CookedDishPrimitives {
		return {
			id: this.id.value,
			name: this.name,
			description: this.description,
			ingredients: this.ingredients.map((ingredient) =>
				ingredient.toPrimitives(),
			),
		};
	}
}
