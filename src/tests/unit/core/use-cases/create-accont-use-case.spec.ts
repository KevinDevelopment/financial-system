import { expect, test, describe, beforeEach, vitest } from "vitest";
import { InMemoryAccountAdapter } from "../../../../infrastructure/in-memory";
import { CreateAccountUseCase } from "../../../../core/application/use-cases";
import { AccountProps } from "../../../../core/domain/props";
import { CreateAccountInputDto } from "../../../../core/application/dto";
import { DataAlreadyExistsError } from "../../../../core/domain/errors";
import { Account } from "../../../../core/domain/entities/account";
import { AccountType } from "../../../../core/domain/entities/account/account-type";

let repository: InMemoryAccountAdapter;
let useCase: CreateAccountUseCase;
const correctValues: CreateAccountInputDto = {
	currentBalance: 1.1,
	initialBalance: 0,
	name: "conta teste",
	type: AccountType.SAVINGS,
	auth: {
		organizationId: 123n,
		userId: 345n,
		role: 2
	}
};

beforeEach(() => {
	repository = new InMemoryAccountAdapter();
	useCase = new CreateAccountUseCase(repository);
});

describe("create account use case tests", () => {
	test("Should call the create method once with correct values", async () => {
		const spyMethodCreate = vitest.spyOn(repository, "create");
		await useCase.perform(correctValues);
		expect(spyMethodCreate).toBeCalledTimes(1);
	});

	test("Should call the find by name method once with correct values", async () => {
		const spyMethodFindByName = vitest.spyOn(repository, "findByName");
		await useCase.perform(correctValues);
		expect(spyMethodFindByName).toBeCalledTimes(1);
		expect(spyMethodFindByName).toBeCalledWith(
			correctValues.name,
			correctValues.auth.userId as bigint,
		);
	});

	test("Should return an error if account exists with same name for the user", async () => {
		const account = Account.create({ 
			...correctValues,
			organizationId: correctValues.auth.organizationId,
			userId: correctValues.auth.userId
		 });
		repository.create(account);

		try {
			await useCase.perform(correctValues);
		} catch (error) {
			expect(error).toBeInstanceOf(DataAlreadyExistsError);
			expect(error?.message).toBe(
				"Ja existe uma conta com este nome para o usuário",
			);
			expect(error?.status).toBe(409);
		}
	});
});
