import { createOpenAI } from "@ai-sdk/openai";
import { embed } from "ai";

import { EmbeddingsGenerator } from "../domain/EmbeddingsGenerator";

export class AiSdkEmbeddingsGenerator implements EmbeddingsGenerator {
	private readonly model;

	constructor(baseUrl: string, apiKey: string, modelName: string) {
		this.model = createOpenAI({
			baseURL: baseUrl,
			apiKey,
		}).embedding(modelName);
	}

	async embed(text: string): Promise<number[]> {
		const { embedding } = await embed({
			model: this.model,
			value: text,
		});

		return embedding;
	}
}
