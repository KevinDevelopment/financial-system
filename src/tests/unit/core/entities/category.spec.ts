import { expect, test, describe, beforeEach } from "vitest";
import { CategoryProps } from "../../../../core/props";
import { Category } from "../../../../core/entities";
import { BusinessRuleViolationError } from "../../../../core/exception";

let baseCategory: CategoryProps;

beforeEach(() => {
    baseCategory = Object.freeze({
        id: 123n,
        name: "Categoria teste",
        color: "#000000",
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
            new BusinessRuleViolationError("Nome deve ter entre 2 e 100 caracteres", 422),
        );
    });

    test("Should return an error if name is more than 100 characters", () => {
        const longName = "A".repeat(101);
        const category = () => {
            return Category.create({ ...baseCategory, name: longName });
        };
        expect(category).toThrowError(
            new BusinessRuleViolationError("Nome deve ter entre 2 e 100 caracteres", 422),
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
        const category = Category.create({ ...baseCategory, color: "rgba(255, 0, 0, 0.5)" });
        expect(category.color.value).toEqual("rgba(255, 0, 0, 0.5)");
    });

    test("Should create a category with a valid named color", () => {
        const category = Category.create({ ...baseCategory, color: "blue" });
        expect(category.color.value).toEqual("blue");
    });
});
