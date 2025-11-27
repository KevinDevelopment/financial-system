import { expect, test, describe, beforeEach, vitest } from "vitest";
import { CreateOrganizationUseCase } from "../../../../core/use-cases";
import { InMemoryOrganizationAdapter } from "../../../../infrastructure/in-memory";
import { CreateOrganizationInputDto } from "../../../../core/dto";
import { Organization } from "../../../../core/entities";
import { DataAlreadyExistsError } from "../../../../core/exception";

let repository: InMemoryOrganizationAdapter;
let useCase: CreateOrganizationUseCase;
let correctValues: CreateOrganizationInputDto = {
	name: "Empresa teste",
	cnpj: "91.054.462/0001-47",
	socialReason: "Empresa teste do Goku",
	mobilePhone: "5511965783456",
	address: {
		city: "São Paulo",
		country: "Brasil",
		state: "São Paulo",
		street: "Rua José da Silva",
		complement: "Casa 200",
		neighborhood: "Vila Santa Terezinha",
		number: 40,
	},
};

beforeEach(() => {
	repository = new InMemoryOrganizationAdapter();
	useCase = new CreateOrganizationUseCase(repository);
});

describe("create organization use case tests", () => {
	test("Should call the create method once", async () => {
		const spyMethodCreate = vitest.spyOn(repository, "create");
		await useCase.perform(correctValues);
		expect(spyMethodCreate).toBeCalledTimes(1);
	});

	test("Should return an error if organization exists with same cnpj", async () => {
		const organization = Organization.create(correctValues);
		repository.create(organization);

		try {
			await useCase.perform(correctValues);
		} catch (error) {
			expect(error).toBeInstanceOf(DataAlreadyExistsError);
			expect(error.message).toBe("organization already exists with this cnpj");
			expect(error?.status).toBe(409);
		}
	});

	test("Should return an error if organization exists with same name", async () => {
		const organization = Organization.create({
			...correctValues,
			cnpj: "85.169.115/0001-67",
		});
		repository.create(organization);

		try {
			await useCase.perform(correctValues);
		} catch (error) {
			expect(error).toBeInstanceOf(DataAlreadyExistsError);
			expect(error?.message).toBe("organization already exists with this name");
			expect(error?.status).toBe(409);
		}
	});
});
