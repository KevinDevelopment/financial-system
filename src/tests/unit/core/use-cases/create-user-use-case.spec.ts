import { expect, test, describe, beforeEach, vitest } from "vitest";
import {
	InMemoryUserAdapter,
	InMemoryPasswordHasherAdapter,
} from "../../../../infrastructure/in-memory";
import { CreateUserUseCase } from "../../../../core/aplication/use-cases";
import { CreateUserInputDto } from "../../../../core/aplication/dto";
import {
	DataAlreadyExistsError,
	BusinessRuleViolationError,
} from "../../../../core/domain/errors";
import { User } from "../../../../core/domain/entities/user";
import { UserProps } from "../../../../core/domain/props";

let repository: InMemoryUserAdapter;
let passwordHasher: InMemoryPasswordHasherAdapter;
let useCase: CreateUserUseCase;
const correctValues: CreateUserInputDto = {
	name: "Kevin jones",
	email: "kevinjones@outlook.com",
	password: "G$5IFG0t4905ggjiwo499",
	organizationId: 65665656n,
	role: 2,
};

const userProps: UserProps = {
	name: "Kevin jones",
	email: "kevinjones@outlook.com",
	passwordHash: "G$5IFG0t4905ggjiwo499",
	organizationId: 65665656n,
	role: 2,
};

beforeEach(() => {
	repository = new InMemoryUserAdapter();
	passwordHasher = new InMemoryPasswordHasherAdapter();
	useCase = new CreateUserUseCase(repository, passwordHasher);
});

describe("create user use case tests", () => {
	test("Should call repository.create with a valid User", async () => {
		const spyMethodCreate = vitest.spyOn(repository, "create");
		await useCase.perform(correctValues);
		expect(spyMethodCreate).toHaveBeenCalledTimes(1);
		const createdUser = spyMethodCreate.mock.calls[0][0];

		expect(createdUser).toEqual(
			expect.objectContaining({
				email: expect.objectContaining({
					value: correctValues.email,
				}),
				name: expect.objectContaining({
					value: correctValues.name,
				}),
				role: expect.anything(),
			}),
		);
	});

	test("Should call repository.findByEmail with the correct email", async () => {
		const spyMethodFindByEmail = vitest.spyOn(repository, "findByEmail");

		await useCase.perform(correctValues);

		expect(spyMethodFindByEmail).toHaveBeenCalledTimes(1);
		expect(spyMethodFindByEmail).toHaveBeenCalledWith(correctValues.email);
	});

	test("Should retun an error if user exists with the same email", async () => {
		const user = User.create(userProps);
		repository.create(user);

		try {
			await useCase.perform(correctValues);
		} catch (error) {
			expect(error).toBeInstanceOf(DataAlreadyExistsError);
			expect(error.message).toBe("Ja existe um usuário com este email");
			expect(error.status).toBe(409);
		}
	});

	test("Should create an user and return its id, name and email if values are correct", async () => {
		const response = await useCase.perform(correctValues);
		expect(response).toHaveProperty("id");
		expect(typeof response.id).toBe("bigint");
		expect(response.name).toEqual("Kevin jones");
		expect(response.email).toEqual("kevinjones@outlook.com");
	});

	test("Shoul return anr error if password is not a string", async () => {
		try {
			await useCase.perform({ ...correctValues, password: 4343433 as any });
		} catch (error) {
			expect(error).toBeInstanceOf(BusinessRuleViolationError);
			expect(error.message).toBe("Senha inválida");
			expect(error.status).toBe(422);
		}
	});

	test("Should return an error if password is empty", async () => {
		try {
			await useCase.perform({ ...correctValues, password: "" });
		} catch (error) {
			expect(error).toBeInstanceOf(BusinessRuleViolationError);
			expect(error.message).toBe("Senha não pode ser vazia");
			expect(error.status).toBe(422);
		}
	});

	test("Should return an error if password has space", async () => {
		try {
			await useCase.perform({
				...correctValues,
				password: "gfgfgfgfgfgfgg  665##$%FKFJE9KDMN",
			});
		} catch (error) {
			expect(error).toBeInstanceOf(BusinessRuleViolationError);
			expect(error.message).toBe("Senha não pode conter espaços");
			expect(error.status).toBe(422);
		}
	});

	test("Should return an error if password less than 12 characters", async () => {
		try {
			await useCase.perform({ ...correctValues, password: "gf" });
		} catch (error) {
			expect(error).toBeInstanceOf(BusinessRuleViolationError);
			expect(error.message).toBe("Senha deve conter no mínimo 12 caracteres");
			expect(error.status).toBe(422);
		}
	});

	test("Should return an error if password doesn't contain uppercase letters", async () => {
		try {
			await useCase.perform({
				...correctValues,
				password: "ggggggggggggggggggggggggggg",
			});
		} catch (error) {
			expect(error).toBeInstanceOf(BusinessRuleViolationError);
			expect(error.message).toBe(
				"Senha deve conter ao menos uma letra maiúscula",
			);
			expect(error.status).toBe(422);
		}
	});

	test("Should return an error if password doesn't contain lowercase letters", async () => {
		try {
			await useCase.perform({
				...correctValues,
				password: "GGGGGGGGGGGGGGGGGGGGGGGGGGGG",
			});
		} catch (error) {
			expect(error).toBeInstanceOf(BusinessRuleViolationError);
			expect(error.message).toBe(
				"Senha deve conter ao menos uma letra minúscula",
			);
			expect(error.status).toBe(422);
		}
	});

	test("Should return na error if password doesn't contain numbers", async () => {
		try {
			await useCase.perform({
				...correctValues,
				password: "vfffffdGFGFG!!!***&&&ffffefef",
			});
		} catch (error) {
			expect(error).toBeInstanceOf(BusinessRuleViolationError);
			expect(error.message).toBe("Senha deve conter ao menos um número");
			expect(error.status).toBe(422);
		}
	});

	test("Should return an error if password doesn't contain special characters", async () => {
		try {
			await useCase.perform({
				...correctValues,
				password: "gfgfgfgTRTRT544545465656565663ffd",
			});
		} catch (error) {
			expect(error).toBeInstanceOf(BusinessRuleViolationError);
			expect(error.message).toBe(
				"Senha deve conter ao menos um caractere especial",
			);
			expect(error.status).toBe(422);
		}
	});
});
