export abstract class EmbeddingsGenerator {
	abstract embed(text: string): Promise<number[]>;
}
