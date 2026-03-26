import { CookedDishCreator } from "../../../../../../src/contexts/dishes/cooked-dishes/application/create/CookedDishCreator";
import { CookedDishMother } from "../../domain/CookedDishMother";
import { MockCookedDishRepository } from "../../infrastructure/MockCookedDishRepository";

describe("CookedDishCreator should", () => {
	const repository = new MockCookedDishRepository();
	const creator = new CookedDishCreator(repository);

	it("create a cooked dish", async () => {
		const expectedDish = CookedDishMother.create();
		const primitives = expectedDish.toPrimitives();

		repository.shouldSave(expectedDish);

		await creator.create(
			primitives.id,
			primitives.name,
			primitives.description,
			primitives.ingredients,
		);
	});
});
