import { expect, test, describe, beforeEach } from "vitest";
import { OrganizationProps } from "../../../../core/props";
import { Organization } from "../../../../core/entities";
import { AddressProps } from "../../../../core/props";
import { Address } from "../../../../core/value-objects";
import { BusinessRuleViolationError } from "../../../../core/exception";

let baseAddress: AddressProps;
let baseOrganization: OrganizationProps;

beforeEach(() => {
	baseAddress = Object.freeze({
		city: "São Paulo",
		country: "Brasil",
		state: "São Paulo",
		street: "Rua José da Silva",
		complement: "Casa 200",
		neighborhood: "Vila Santa Terezinha",
		number: 40,
	});

	baseOrganization = Object.freeze({
		id: 123n,
		name: "Empresa teste",
		cnpj: "91.054.462/0001-47",
		socialReason: "Empresa teste do Goku",
		mobilePhone: "5511965783456",
		address: baseAddress,
	});
});

describe("entity organization tests", () => {
	test("Should create a valid organization if values are provided", () => {
		const organization = Organization.create(baseOrganization);
		const address = Address.create(baseAddress);
		const isEqualAddress = address.equals(organization?.address);

		expect(organization.name).toEqual("Empresa teste");
		expect(organization.id?.value).toEqual(123n);
		expect(organization.cnpj?.value).toEqual("91054462000147");
		expect(organization.socialReason).toEqual("Empresa teste do Goku");
		expect(organization.mobilePhone).toEqual("5511965783456");
		expect(isEqualAddress).toBeTruthy();
	});

	test("Should return an error if name is not provided", () => {
		const organization = () => {
			return Organization.create({ ...baseOrganization, name: "" });
		};
		expect(organization).toThrowError(
			new BusinessRuleViolationError("Nome da empresa é obrigatório", 422),
		);
	});

	test("Should return an Id if is not provided", () => {
		const organization = Organization.create({
			...baseOrganization,
			id: "" as null,
		});
		expect(organization?.id?.value).toBeTruthy();
	});
});
