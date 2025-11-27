import { expect, test, describe, beforeEach } from "vitest";
import { Address } from "../../../../core/value-objects";
import { AddressProps } from "../../../../core/props";
import {
	BusinessRuleViolationError,
	MissingDataError,
} from "../../../../core/exception";

let baseAddress: AddressProps;

beforeEach(() => {
	baseAddress = Object.freeze({
		city: "São Paulo",
		country: "Brasil",
		state: "São Paulo",
		street: "Rua José da Silva",
		complement: "Casa 200",
		neighborhood: "Vila Santa Terezinha",
		zipCode: "08234956",
		number: 40,
	});
});

describe("Address value object tests", () => {
	test("should create a valid address if values are provided", () => {
		const address = Address.create(baseAddress);

		expect(address.city).toEqual("São Paulo");
		expect(address.street).toEqual("Rua José da Silva");
		expect(address.state).toEqual("São Paulo");
		expect(address.country).toEqual("Brasil");
		expect(address.number).toEqual(40);
		expect(address.complement).toEqual("Casa 200");
		expect(address.neighborhood).toEqual("Vila Santa Terezinha");
		expect(address.zipCode).toEqual("08234956");
	});

	test("should return the correct plain object when toValue is called", () => {
		const address = Address.create(baseAddress);
		const result = address.toValue();
		expect(result).toEqual(baseAddress);
		expect(result).not.toBe(address);
	});

	test("Should return an error if street is not provided", () => {
		const address = () => {
			return Address.create({
				...baseAddress,
				street: "",
				city: "",
			});
		};
		expect(address).toThrowError(
			new MissingDataError("Obrigatório informar a rua", 422),
		);
	});

	test("Should return an error if city is not provided", () => {
		const address = () => {
			return Address.create({
				...baseAddress,
				city: "",
			});
		};
		expect(address).toThrowError(
			new MissingDataError("Obrigatório informar a cidade", 422),
		);
	});

	test("Should return an error if state is not provided", () => {
		const address = () => {
			return Address.create({
				...baseAddress,
				state: "",
			});
		};
		expect(address).toThrowError(
			new MissingDataError("Obrigatório informar o estado", 422),
		);
	});

	test("Should return an error if country is not provided", () => {
		const address = () => {
			return Address.create({
				...baseAddress,
				country: "",
			});
		};
		expect(address).toThrowError(
			new MissingDataError("Obrigatório informar o país", 422),
		);
	});

	test("Should return an error if CEP is invalid", () => {
		const address = () => {
			return Address.create({
				...baseAddress,
				zipCode: "66666666666666666666666666666",
			});
		};
		expect(address).toThrowError(
			new BusinessRuleViolationError("CEP inválido", 422),
		);
	});

	test("Should return an error if equals to called with empty arguments", () => {
		const address = Address.create(baseAddress);
		const invalidMethod = address.equals(null);

		expect(invalidMethod).toBeFalsy();
	});
});
