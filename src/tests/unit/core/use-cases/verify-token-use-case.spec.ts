import { expect, test, describe, beforeEach, vitest } from "vitest";
import { InMemoryTokenServiceAdapter } from "../../../../infrastructure/in-memory";
import { VerifyTokenUseCase } from "../../../../core/application/use-cases";
import {
	VerifyTokenInputDto,
	VerifyTokenOutputDto,
} from "../../../../core/application/dto";
import {
	MissingDataError,
	InvalidValueError,
} from "../../../../core/domain/errors";

let tokenService: InMemoryTokenServiceAdapter;
let useCase: VerifyTokenUseCase;

const correctInput: VerifyTokenInputDto = {
	token: "fake-token",
};

const mockTokenResponse: VerifyTokenOutputDto = {
	sub: 123n,
	organizationId: 12345n,
	role: 1,
};

beforeEach(() => {
	tokenService = new InMemoryTokenServiceAdapter();
	useCase = new VerifyTokenUseCase(tokenService);
});

describe("verify token use case test", () => {
	test("Should return an error if token is not provided", async () => {
		const input = { token: "" };

		try {
			await useCase.perform(input);
		} catch (error) {
			expect(error).toBeInstanceOf(MissingDataError);
			expect(error.message).toBe("Token de acesso não informado");
			expect(error?.status).toBe(401);
		}
	});

	test("Should return an error if token is different from string", async () => {
		const input = { token: 5454 as any };

		try {
			await useCase.perform(input);
		} catch (error) {
			expect(error).toBeInstanceOf(InvalidValueError);
			expect(error.message).toBe("Token de acesso inválido");
			expect(error?.status).toBe(401);
		}
	});

	test("Should return an error if token contains spaces", async () => {
		const input = { token: "fake token" };

		try {
			await useCase.perform(input);
		} catch (error) {
			expect(error).toBeInstanceOf(InvalidValueError);
			expect(error.message).toBe("Token de acesso inválido");
			expect(error?.status).toBe(401);
		}
	});

	test("Should by pass in verify", async () => {
		const input = { token: "fake-token" };
		const spyMethodCreateVerify = vitest
			.spyOn(tokenService, "verify")
			.mockResolvedValue(mockTokenResponse);
		const result = await useCase.perform(input);

		expect(spyMethodCreateVerify).toHaveBeenCalledWith("access", "fake-token");

		expect(result).toEqual(mockTokenResponse);
		expect(result.sub).toBe(123n);
		expect(result.organizationId).toBe(12345n);
		expect(result.role).toBe(1);
	});

	test("Should throw InvalidValueError when token verification fails", async () => {
		const spyMethodCreateVerify = vitest
			.spyOn(tokenService, "verify")
			.mockRejectedValueOnce(new Error("Token expirado"));

		try {
			await useCase.perform(correctInput);
		} catch (error) {
			expect(error).toBeInstanceOf(InvalidValueError);
			expect(error.message).toBe("Token inválido ou expirado");
			expect(error?.status).toBe(401);
			expect(spyMethodCreateVerify).toHaveBeenCalledTimes(1);
		}
	});
});
