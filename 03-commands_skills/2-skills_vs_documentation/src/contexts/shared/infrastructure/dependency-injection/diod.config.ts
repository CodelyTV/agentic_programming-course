import "reflect-metadata";

import { ContainerBuilder } from "diod";

import { CookedDishCreator } from "../../../dishes/cooked-dishes/application/create/CookedDishCreator";
import { AllCookedDishesSearcher } from "../../../dishes/cooked-dishes/application/search-all/AllCookedDishesSearcher";
import { CookedDishByIdSearcher } from "../../../dishes/cooked-dishes/application/search-by-id/CookedDishByIdSearcher";
import { CookedDishesBySimilarIngredientsSearcher } from "../../../dishes/cooked-dishes/application/search-by-similar-ingredients/CookedDishesBySimilarIngredientsSearcher";
import { CookedDishRepository } from "../../../dishes/cooked-dishes/domain/CookedDishRepository";
import { PostgresCookedDishRepository } from "../../../dishes/cooked-dishes/infrastructure/PostgresCookedDishRepository";
import { DishByIngredientsSuggester } from "../../../dishes/dishes/application/suggest/DishByIngredientsSuggester";
import { DishByIngredientsSuggesterGateway } from "../../../dishes/dishes/domain/DishByIngredientsSuggesterGateway";
import { AiSdkMinistral3DishByIngredientsSuggesterGateway } from "../../../dishes/dishes/infraestructure/AiSdkMinistral3DishByIngredientsSuggesterGateway";
import { EmbeddingsGenerator } from "../../domain/EmbeddingsGenerator";
import { EventBus } from "../../domain/event/EventBus";
import { UuidGenerator } from "../../domain/UuidGenerator";
import { AiSdkEmbeddingsGenerator } from "../AiSdkEmbeddingsGenerator";
import { InMemoryEventBus } from "../domain-event/InMemoryEventBus";
import { NativeUuidGenerator } from "../NativeUuidGenerator";
import { PostgresConnection } from "../postgres/PostgresConnection";

const builder = new ContainerBuilder();

// Shared
builder
	.register(PostgresConnection)
	.useFactory(() => {
		return new PostgresConnection(
			"localhost",
			5432,
			"supabase_admin",
			"c0d3ly7v",
			"postgres",
		);
	})
	.asSingleton();

builder.register(UuidGenerator).use(NativeUuidGenerator);
builder
	.register(EmbeddingsGenerator)
	.useFactory(
		() =>
			new AiSdkEmbeddingsGenerator(
				"http://localhost:11434/v1",
				"ollama",
				"qwen3-embedding:0.6b",
			),
	);
builder.registerAndUse(InMemoryEventBus).asSingleton();

builder
	.register(EventBus)
	.useFactory((deps) => deps.get(InMemoryEventBus))
	.asSingleton();

// Dishes
builder
	.register(DishByIngredientsSuggesterGateway)
	.useFactory(
		() =>
			new AiSdkMinistral3DishByIngredientsSuggesterGateway(
				"http://localhost:11434/v1",
				"ollama",
			),
	);

builder.registerAndUse(DishByIngredientsSuggester);

// Dishes - CookedDish
builder.register(CookedDishRepository).use(PostgresCookedDishRepository);
builder.registerAndUse(PostgresCookedDishRepository);
builder.registerAndUse(CookedDishCreator);
builder.registerAndUse(AllCookedDishesSearcher);
builder.registerAndUse(CookedDishByIdSearcher);
builder.registerAndUse(CookedDishesBySimilarIngredientsSearcher);

export const container = builder.build();
