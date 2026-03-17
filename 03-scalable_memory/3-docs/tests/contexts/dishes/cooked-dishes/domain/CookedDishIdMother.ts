import { faker } from "@faker-js/faker";

import { CookedDishId } from "../../../../../src/contexts/dishes/cooked-dishes/domain/CookedDishId";

export class CookedDishIdMother {
	static create(value?: string): CookedDishId {
		return new CookedDishId(value ?? faker.string.uuid());
	}
}
