import { expect, test, describe, beforeEach } from "vitest";
import { RefreshTokenProps } from "../../../../core/domain/props";
import { RefreshToken } from "../../../../core/domain/entities/refresh-token";
import { BusinessRuleViolationError } from "../../../../core/domain/errors";

let baseRefreshToken: RefreshTokenProps;

beforeEach(() => {
	baseRefreshToken = Object.freeze({
		id: 123n,
		userId: 567n,
		organizationId: 6789n,
		expiresAt: new Date(),
		revokedAt: new Date(),
	});
});

describe("entity refresh token tests", () => {
	test("Should create a valid refresh token if values are provided", () => {
		const refreshToken = RefreshToken.create(baseRefreshToken);

		expect(refreshToken.isExpired()).toBe(true);
		expect(refreshToken.isRevoked()).toBe(true);
		expect(refreshToken).toBeInstanceOf(RefreshToken);
	});

	test("Should return a valid organization id if is it a number", () => {
		const category = RefreshToken.create({
			...baseRefreshToken,
			id: 10 as any,
		});
		expect(category.organizationId.value).toBeTypeOf("bigint");
	});

	test("Should return an error if user id less than 0", async () => {
		const category = () => {
			return RefreshToken.create({ ...baseRefreshToken, userId: 0n });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError("UserId inválido", 422),
		);
	});

	test("Should return an error if user id id is null", async () => {
		const category = () => {
			return RefreshToken.create({ ...baseRefreshToken, userId: null });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError("Obrigatório informar o usuário", 422),
		);
	});

	test("Should return an error if user id is not a valid number", async () => {
		const category = () => {
			return RefreshToken.create({ ...baseRefreshToken, userId: NaN });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError("UserId deve ser um número inteiro", 422),
		);
	});

	test("Should return an error if user id is a string", async () => {
		const category = () => {
			return RefreshToken.create({ ...baseRefreshToken, userId: "fddfdffdf" });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError(
				"UserId deve ser um número inteiro válido",
				422,
			),
		);
	});

	test("Should return an error if user id is not valid", async () => {
		const category = () => {
			return RefreshToken.create({ ...baseRefreshToken, userId: {} });
		};
		expect(category).toThrowError(
			new BusinessRuleViolationError("UserId inválido", 422),
		);
	});
});
