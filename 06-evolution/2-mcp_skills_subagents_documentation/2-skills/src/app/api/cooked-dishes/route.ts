import "reflect-metadata";

import { NextResponse } from "next/server";

import { AllCookedDishesSearcher } from "../../../contexts/dishes/cooked-dishes/application/search-all/AllCookedDishesSearcher";
import { container } from "../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../contexts/shared/infrastructure/http/HttpNextResponse";

const searcher = container.get(AllCookedDishesSearcher);

export async function GET(): Promise<NextResponse> {
	const dishes = await searcher.searchAll();

	return HttpNextResponse.json(dishes);
}
