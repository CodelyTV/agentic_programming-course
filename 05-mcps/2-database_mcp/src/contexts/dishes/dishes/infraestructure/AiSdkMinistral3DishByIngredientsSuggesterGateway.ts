import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { Service } from "diod";
import { z } from "zod";

import { Ingredient } from "../../../shared/domain/Ingredient";
import { IngredientType } from "../../../shared/domain/IngredientType";
import { Dish } from "../domain/Dish";
import { DishByIngredientsSuggesterGateway } from "../domain/DishByIngredientsSuggesterGateway";

const DishSchema = z.object({
	name: z.string(),
	description: z.string(),
	ingredients: z.array(
		z.object({
			name: z.string(),
			type: z.enum(["main", "household_staple"]),
		}),
	),
});

@Service()
export class AiSdkMinistral3DishByIngredientsSuggesterGateway implements DishByIngredientsSuggesterGateway {
	private readonly model;

	constructor(baseUrl: string, apiKey: string) {
		this.model = createOpenAI({
			baseURL: baseUrl,
			apiKey,
		})("ministral-3:3b");
	}

	async suggest(
		ingredients: Ingredient[],
		excludedDishNames: string[],
	): Promise<Dish> {
		const ingredientList = ingredients.map((i) => i.name).join(", ");
		const excludedDishesSection =
			excludedDishNames.length === 0
				? ""
				: `\nDISHES TO AVOID (already cooked with similar ingredients):\n${excludedDishNames.join(", ")}\n`;

		const { output } = await generateText({
			model: this.model,
			output: Output.object({ schema: DishSchema }),
			prompt: `You are a chef. Suggest a dish based on the following ingredients.

MAIN INGREDIENTS (these MUST be the star/protagonist of the dish):
${ingredientList}
${excludedDishesSection}

IMPORTANT RULES:
- The main ingredients listed above MUST be the protagonists of the dish
- You may also use basic pantry items: salt, pepper, and water (these are household staples)
- Do NOT add any other ingredients that are not listed above
- The dish must be realistic and achievable with just these ingredients
- Do NOT suggest any dish with a name that matches or is a close variant of the dishes to avoid

Return the dish with:
- name: the dish name
- description: a brief description
- ingredients: array of objects with "name" (ingredient with quantity) and "type" ("main" for the main ingredients provided, "household_staple" for basic pantry items like salt, pepper, water)`,
		});

		const dishIngredients = output.ingredients.map((ingredient) =>
			ingredient.type === IngredientType.Main
				? Ingredient.main(ingredient.name)
				: Ingredient.householdStaple(ingredient.name),
		);

		return new Dish(output.name, output.description, dishIngredients);
	}
}
