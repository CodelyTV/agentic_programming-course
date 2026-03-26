import { Service } from "diod";
import { Row } from "postgres";

import { EmbeddingsGenerator } from "../../../shared/domain/EmbeddingsGenerator";
import { PostgresConnection } from "../../../shared/infrastructure/postgres/PostgresConnection";
import { PostgresRepository } from "../../../shared/infrastructure/postgres/PostgresRepository";
import { CookedDish } from "../domain/CookedDish";
import { CookedDishId } from "../domain/CookedDishId";
import { CookedDishRepository } from "../domain/CookedDishRepository";

@Service()
export class PostgresCookedDishRepository
	extends PostgresRepository<CookedDish>
	implements CookedDishRepository
{
	constructor(
		connection: PostgresConnection,
		private readonly embeddingsGenerator: EmbeddingsGenerator,
	) {
		super(connection);
	}

	async save(dish: CookedDish): Promise<void> {
		const primitives = dish.toPrimitives();
		const embedding = await this.generateEmbedding(dish);

		await this.execute`
			INSERT INTO dishes.cooked_dishes (id, name, description, ingredients, embedding)
			VALUES (
				${primitives.id},
				${primitives.name},
				${primitives.description},
				${this.sql.json(primitives.ingredients)},
				${embedding}
			);
		`;
	}

	async searchById(id: CookedDishId): Promise<CookedDish | null> {
		return this.searchOne`
			SELECT id, name, description, ingredients
			FROM dishes.cooked_dishes
			WHERE id = ${id.value};
		`;
	}

	async searchAll(): Promise<CookedDish[]> {
		return this.searchMany`
			SELECT id, name, description, ingredients
			FROM dishes.cooked_dishes
			ORDER BY cooked_at DESC;
		`;
	}

	async searchByRecentSimilarIngredients(
		ingredientNames: string[],
	): Promise<CookedDish[]> {
		const queryText = `Ingredients: ${ingredientNames.join(", ")}`;
		const embedding = await this.embeddingsGenerator.embed(queryText);
		const embeddingJson = JSON.stringify(embedding);

		return this.searchMany`
			SELECT id, name, description, ingredients
			FROM dishes.cooked_dishes
			WHERE cooked_at >= NOW() - INTERVAL '1 month'
			ORDER BY embedding <=> ${embeddingJson}::vector
			LIMIT 5;
		`;
	}

	protected toAggregate(row: Row): CookedDish {
		return CookedDish.fromPrimitives({
			id: row.id as string,
			name: row.name as string,
			description: row.description as string,
			ingredients: row.ingredients as { name: string; type: string }[],
		});
	}

	private async generateEmbedding(dish: CookedDish): Promise<string> {
		const text = this.formatDishForEmbedding(dish);
		const vector = await this.embeddingsGenerator.embed(text);

		return JSON.stringify(vector);
	}

	private formatDishForEmbedding(dish: CookedDish): string {
		const ingredients = dish.ingredients.map((i) => i.name).join(", ");

		return `Name: ${dish.name}|Description: ${dish.description}|Ingredients: ${ingredients}`;
	}
}
