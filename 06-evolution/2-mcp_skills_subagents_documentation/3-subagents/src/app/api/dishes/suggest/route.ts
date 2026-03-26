import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { DishByIngredientsSuggester } from "../../../../contexts/dishes/dishes/application/suggest/DishByIngredientsSuggester";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../contexts/shared/infrastructure/http/HttpNextResponse";

const suggester = container.get(DishByIngredientsSuggester);

export async function GET(request: NextRequest): Promise<NextResponse> {
	const ingredients = request.nextUrl.searchParams.getAll("ingredients");
	const dish = await suggester.suggest(ingredients);

	return HttpNextResponse.json(dish);
}
