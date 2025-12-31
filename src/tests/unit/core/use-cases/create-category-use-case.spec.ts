import { expect, test, describe, beforeEach, vitest } from "vitest";
import { InMemoryCategoryAdapter } from "../../../../infrastructure/in-memory";
import { CreateCategoryUseCase } from "../../../../core/aplication/use-cases/create-category-use-case";
import { CategoryProps } from "../../../../core/domain/props";
import { DataAlreadyExistsError } from "../../../../core/domain/errors";
import { Category } from "../../../../core/domain/entities/category";

let repository: InMemoryCategoryAdapter;
let useCase: CreateCategoryUseCase;
const correctValues: CategoryProps = {
	name: "Categoria teste",
	color: "#000000",
	organizationId: 656565n,
	description: "Descrição da categoria teste",
};

beforeEach(() => {
	repository = new InMemoryCategoryAdapter();
	useCase = new CreateCategoryUseCase(repository);
});

describe("create category use case tests", () => {
	test("Should call the create method once", async () => {
		const spyMethodCreate = vitest.spyOn(repository, "create");
		await useCase.perform(correctValues);
		expect(spyMethodCreate).toBeCalledTimes(1);
	});

	test("Should return an error if category exists with same name", async () => {
		const category = Category.create(correctValues);
		repository.create(category);

		try {
			await useCase.perform(correctValues);
		} catch (error) {
			expect(error).toBeInstanceOf(DataAlreadyExistsError);
			expect(error?.message).toBe("Ja existe uma categoria com este nome");
			expect(error?.status).toBe(409);
		}
	});
});
