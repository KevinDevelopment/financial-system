import { expect, test, describe, beforeEach } from "vitest";
import { OrganizationProps } from "../../../../core/props";
import { Organization } from "../../../../core/entities";
import { AddressProps } from "../../../../core/props";
import { Address } from "../../../../core/value-objects/organization";
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
		phone: "5511965783456",
		address: baseAddress,
	});
});

describe("entity organization tests", () => {
	test("Should create a valid organization if values are provided", () => {
		const organization = Organization.create(baseOrganization);
		const address = Address.create(baseAddress);
		const isEqualAddress = address.equals(organization?.address);

		expect(organization.name.value).toEqual("Empresa teste");
		expect(organization.id?.value).toEqual(123n);
		expect(organization.cnpj?.value).toEqual("91054462000147");
		expect(organization.socialReason).toEqual("Empresa teste do Goku");
		expect(organization.phone).toEqual("5511965783456");
		expect(isEqualAddress).toBeTruthy();
	});

	test("Should return an error if name is not provided", () => {
		const organization = () => {
			return Organization.create({ ...baseOrganization, name: "" });
		};
		expect(organization).toThrowError(
			new BusinessRuleViolationError("Nome não pode ser vazio", 422),
		);
	});

	test("Should return an error if name is less than 2 characters", () => {
		const organization = () => {
			return Organization.create({ ...baseOrganization, name: "A" });
		};
		expect(organization).toThrowError(
			new BusinessRuleViolationError(
				"Nome deve ter entre 2 e 100 caracteres",
				422,
			),
		);
	});

	test("Should return an error if name is more than 100 characters", () => {
		const longName = "A".repeat(101);
		const organization = () => {
			return Organization.create({ ...baseOrganization, name: longName });
		};
		expect(organization).toThrowError(
			new BusinessRuleViolationError(
				"Nome deve ter entre 2 e 100 caracteres",
				422,
			),
		);
	});

	test("Should return an error if cnpj is invalid", () => {
		const organization = () => {
			return Organization.create({
				...baseOrganization,
				cnpj: "11.111.111/1111-11",
			});
		};
		expect(organization).toThrowError(
			new BusinessRuleViolationError("CNPJ inválido: 11.111.111/1111-11", 422),
		);
	});

	test("Should return an error if cnpj differs from 14 digits", () => {
		const organization = () => {
			return Organization.create({ ...baseOrganization, cnpj: "123456789012" });
		};
		expect(organization).toThrowError(
			new BusinessRuleViolationError("CNPJ inválido: 123456789012", 422),
		);
	});

	test("Should return an foramtted cnpj", () => {
		const organization = Organization.create({
			...baseOrganization,
			cnpj: "91054462000147",
		});
		expect(organization?.cnpj?.formatted).toEqual("91.054.462/0001-47");
	});

	test("Should return an Id if is not provided", () => {
		const organization = Organization.create({
			...baseOrganization,
			id: "" as null,
		});
		expect(organization?.id?.value).toBeTruthy();
	});
});
