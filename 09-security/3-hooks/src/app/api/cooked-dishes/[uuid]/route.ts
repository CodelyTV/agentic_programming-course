import "reflect-metadata";

import { NextRequest, NextResponse } from "next/server";

import { CookedDishCreator } from "../../../../contexts/dishes/cooked-dishes/application/create/CookedDishCreator";
import { CookedDishByIdSearcher } from "../../../../contexts/dishes/cooked-dishes/application/search-by-id/CookedDishByIdSearcher";
import { container } from "../../../../contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "../../../../contexts/shared/infrastructure/http/HttpNextResponse";

const creator = container.get(CookedDishCreator);
const searcher = container.get(CookedDishByIdSearcher);

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse> {
	const { uuid } = await params;
	const dish = await searcher.search(uuid);

	if (!dish) {
		return HttpNextResponse.notFound();
	}

	return HttpNextResponse.ok(dish);
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ uuid: string }> },
): Promise<NextResponse> {
	const { uuid } = await params;
	const body = await request.json();
	const { name, description, ingredients } = body;

	await creator.create(uuid, name, description, ingredients);

	return HttpNextResponse.created();
}
