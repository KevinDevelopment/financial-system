import { expect, test, describe, beforeEach } from "vitest";
import { UserProps } from "../../../../core/domain/props";
import { User } from "../../../../core/domain/entities/user";
import { BusinessRuleViolationError } from "../../../../core/domain/errors";

let baseUser: UserProps;

beforeEach(() => {
	baseUser = Object.freeze({
		id: 4343n,
		name: "Kevin jones",
		email: "kevinjones@outlook.com",
		role: 2,
		organizationId: 5454545n,
		passwordHash: "65j6k5jk65k6j56ij565jj6",
	});
});

describe("entity user tests", () => {
	test("Should create a valid user if values are provided", () => {
		const user = User.create(baseUser);

		expect(user.id.value).toEqual(4343n);
		expect(user.name.value).toEqual("Kevin jones");
		expect(user.email.value).toEqual("kevinjones@outlook.com");
		expect(user.passwordHash.value).toEqual("65j6k5jk65k6j56ij565jj6");
		expect(user.role.type).toEqual(2);
		expect(user.organizationId.value).toEqual(5454545n);
	});

	test("Should return true is role is admin", () => {
		const user = User.create({ ...baseUser, role: 2 });
		expect(user.role.isAdmin()).toBe(true);
	});

	test("Should return an error if email is not a string", () => {
		const user = () => {
			return User.create({ ...baseUser, email: 54554 as any });
		};
		expect(user).toThrowError(
			new BusinessRuleViolationError("Email inválido", 422),
		);
	});

	test("Should return an error if email is not provided", () => {
		const user = () => {
			return User.create({ ...baseUser, email: "" });
		};
		expect(user).toThrowError(
			new BusinessRuleViolationError("Email não pode ser vazio", 422),
		);
	});

	test("Should return an error is not is valid email", () => {
		const user = () => {
			return User.create({ ...baseUser, email: "kevinjones" });
		};
		expect(user).toThrowError(
			new BusinessRuleViolationError("Email inválido", 422),
		);
	});

	test("Should return an email in lower case", () => {
		const user = User.create({ ...baseUser, email: "KEVINjones@outlook.com" });
		expect(user.email.value).toEqual("kevinjones@outlook.com");
	});

	test("Should return an error if name is not provided", () => {
		const user = () => {
			return User.create({ ...baseUser, name: "" });
		};
		expect(user).toThrowError(
			new BusinessRuleViolationError("Nome não pode ser vazio", 422),
		);
	});

	test("Should return an error if name is greater than 100 characters", () => {
		const longName = "A".repeat(101);
		const user = () => {
			return User.create({ ...baseUser, name: longName });
		};
		expect(user).toThrowError(
			new BusinessRuleViolationError(
				"Nome deve ter entre 2 e 100 caracteres",
				422,
			),
		);
	});

	test("Should return an error if name is less than 2 characters", () => {
		const shortName = "q";
		const user = () => {
			return User.create({ ...baseUser, name: shortName });
		};
		expect(user).toThrowError(
			new BusinessRuleViolationError(
				"Nome deve ter entre 2 e 100 caracteres",
				422,
			),
		);
	});

	test("Should return an error ir role is invalid", () => {
		const user = () => {
			return User.create({ ...baseUser, role: 6 });
		};
		expect(user).toThrowError(
			new BusinessRuleViolationError("Role inválida", 422),
		);
	});

	test("Shoulr return an error if password is already defined", () => {
		const user = User.create(baseUser);
		const definePassword = () => {
			user.definePassword("newpasswordhash12345");
		};
		expect(definePassword).toThrowError(
			new BusinessRuleViolationError("Usuário já possui senha definida", 422),
		);
	});
});
