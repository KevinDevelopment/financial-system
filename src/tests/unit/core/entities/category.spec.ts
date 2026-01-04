import { expect, test, describe, beforeEach } from "vitest";
import { CategoryProps } from "../../../../core/domain/props";
import { Category } from "../../../../core/domain/entities/category";
import { BusinessRuleViolationError } from "../../../../core/domain/errors";

let baseCategory: CategoryProps;

beforeEach(() => {
	baseCategory = Object.freeze({
		id: 123n,
		name: "Categoria teste",
		color: "#000000",
		organizationId: 656565n,
		description: "Descrição da categoria teste",
	});
});

describe("entity category tests", () => {
	test("Should create a valid category if values are provided", () => {
		const category = Category.create(baseCategory);

		expect(category.name.value).toEqual("Categoria teste");
		expect(category.id?.value).toEqual(123n);
		expect(category.color.value).toEqual("#000000");
		expect(category.description).toEqual("Descrição da categoria teste");
	});

	test("Should return an error if name is not provided", () => {
		const category = () => {
			return Category.create({ ...baseCategory, name: "" });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError("Nome não pode ser vazio", 422),
		);
	});

	test("Should return an error if name is less than 2 characters", () => {
		const category = () => {
			return Category.create({ ...baseCategory, name: "A" });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"Nome deve ter entre 2 e 100 caracteres",
				422,
			),
		);
	});

	test("Should return an error if name is more than 100 characters", () => {
		const longName = "A".repeat(101);
		const category = () => {
			return Category.create({ ...baseCategory, name: longName });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"Nome deve ter entre 2 e 100 caracteres",
				422,
			),
		);
	});

	test("Should return an error if color is not provided", () => {
		const category = () => {
			return Category.create({ ...baseCategory, color: "" });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError("Cor da categoria inválida", 422),
		);
	});

	test("Should return an error if description exceeds 255 characters", () => {
		const longDescription = "a".repeat(256);
		const category = () => {
			return Category.create({ ...baseCategory, description: longDescription });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"Descrição não pode exceder 255 caracteres",
				422,
			),
		);
	});

	test("Should return an error if color is not a valid hex code", () => {
		const category = () => {
			return Category.create({ ...baseCategory, color: "invalid-color" });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError("Cor da categoria inválida", 422),
		);
	});

	test("Should create a category with a valid RGBA color", () => {
		const category = Category.create({
			...baseCategory,
			color: "rgba(255, 0, 0, 0.5)",
		});
		expect(category.color.value).toEqual("rgba(255, 0, 0, 0.5)");
	});

	test("Should create a category with a valid named color", () => {
		const category = Category.create({ ...baseCategory, color: "blue" });
		expect(category.color.value).toEqual("blue");
	});

	test("Should return a valid organiozation id if is it a number", () => {
		const category = Category.create({ ...baseCategory, id: 10 as any });
		expect(category.organizationId.value).toBeTypeOf("bigint");
	});

	test("Should return an error if organization id less than 0", async () => {
		const category = () => {
			return Category.create({ ...baseCategory, organizationId: 0n });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"OrganizationId inválido",
				422,
			),
		);
	});

	test("Should return an error if organization id is null", async () => {
		const category = () => {
			return Category.create({ ...baseCategory, organizationId: null });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"Obrigatório informar a organização",
				422,
			),
		);
	});

	test("Should return an error if organization id is not a valid number", async () => {
		const category = () => {
			return Category.create({ ...baseCategory, organizationId: NaN });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"OrganizationId deve ser um número inteiro",
				422,
			),
		);
	});

	test("Should return an error if organization id is a string", async () => {
		const category = () => {
			return Category.create({ ...baseCategory, organizationId: "fddfdffdf" });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"OrganizationId deve ser um número inteiro válido",
				422,
			),
		);
	});


	test("Should return an error if organization id is not valid", async () => {
		const category = () => {
			return Category.create({ ...baseCategory, organizationId: {} });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"OrganizationId inválido",
				422,
			),
		);
	});
});
