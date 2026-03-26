import { CookedDishPrimitives } from "../../../../../src/contexts/dishes/cooked-dishes/domain/CookedDish";

export class MockCookedDishesBySimilarIngredientsSearcher {
	private readonly mockSearch = jest.fn();

	async search(_ingredientNames: string[]): Promise<CookedDishPrimitives[]> {
		return this.mockSearch() as CookedDishPrimitives[];
	}

	shouldSearchReturn(dishes: CookedDishPrimitives[]): void {
		this.mockSearch.mockReturnValue(dishes);
	}
}
