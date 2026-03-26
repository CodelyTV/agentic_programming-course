/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";

import jsonDishes from "./dishes.json";


const baseUrl = process.env.API_URL ?? "http://localhost:3000";
const logFilePath = path.join(process.cwd(), "logs", "create-dishes.json.log");

function logDish(
	dishId: string,
	name: string,
	status: "success" | "error",
	error?: string,
): void {
	const logEntry = {
		timestamp: new Date().toISOString(),
		dishId,
		name,
		status,
		...(error && { error }),
	};

	fs.appendFileSync(logFilePath, `${JSON.stringify(logEntry)}\n`);
}

async function createDish(dish: (typeof jsonDishes)[number]): Promise<void> {
	const url = `${baseUrl}/api/cooked-dishes/${dish.id}`;

	const response = await fetch(url, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: dish.name,
			description: dish.description,
			ingredients: dish.ingredients,
		}),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`HTTP ${response.status}: ${errorText}`);
	}
}

async function main(): Promise<void> {
	fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

	console.log(`Creating ${jsonDishes.length} dishes via API at ${baseUrl}...`);

	for (const dish of jsonDishes) {
		try {
			await createDish(dish);
			logDish(dish.id, dish.name, "success");
			console.log(`  ✓ ${dish.name}`);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			logDish(dish.id, dish.name, "error", message);
			console.error(`  ✗ ${dish.name}: ${message}`);
		}
	}
}

main()
	.then(() => console.log("Done!"))
	.catch(console.error);
