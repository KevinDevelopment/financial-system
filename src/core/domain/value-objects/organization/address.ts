import { BusinessRuleViolationError, MissingDataError } from "../../errors";
import { AddressProps } from "../../props";

export class Address {
	private constructor(
		private readonly _street: string,
		private readonly _city: string,
		private readonly _state: string,
		private readonly _country: string,
		private readonly _number?: number,
		private readonly _complement?: string,
		private readonly _neighborhood?: string,
		private readonly _zipCode?: string,
	) {
		Object.freeze(this);
	}

	public static create(props: AddressProps): Address {
		this.validate(props);
		const {
			street,
			city,
			state,
			country,
			number,
			complement,
			neighborhood,
			zipCode,
		} = props;

		return new Address(
			street,
			city,
			state,
			country,
			number,
			complement,
			neighborhood,
			zipCode,
		);
	}

	private static validate(props: {
		street: string;
		city: string;
		state: string;
		country: string;
		number?: number;
		complement?: string;
		neighborhood?: string;
		zipCode?: string;
	}): void {
		const { street, city, state, country, zipCode } = props;

		if (!street) throw new MissingDataError("Obrigatório informar a rua", 422);
		if (!city) throw new MissingDataError("Obrigatório informar a cidade", 422);
		if (!state)
			throw new MissingDataError("Obrigatório informar o estado", 422);
		if (!country)
			throw new MissingDataError("Obrigatório informar o país", 422);

		if (zipCode && !/^\d{5}-?\d{3}$/.test(zipCode)) {
			throw new BusinessRuleViolationError(`CEP inválido`, 422);
		}
	}

	public equals(other: Address): boolean {
		if (!other) return false;

		return (
			this._street === other._street &&
			this._city === other._city &&
			this._state === other._state &&
			this._country === other._country &&
			this._number === other._number &&
			this._complement === other._complement &&
			this._neighborhood === other._neighborhood &&
			this._zipCode === other._zipCode
		);
	}

	public toValue(): AddressProps {
		return {
			street: this._street,
			city: this._city,
			state: this._state,
			country: this._country,
			number: this._number,
			complement: this._complement,
			neighborhood: this._neighborhood,
			zipCode: this._zipCode,
		};
	}

	public get street(): string {
		return this._street;
	}
	public get city(): string {
		return this._city;
	}
	public get state(): string {
		return this._state;
	}
	public get country(): string {
		return this._country;
	}
	public get number(): number | undefined {
		return this._number;
	}
	public get complement(): string | undefined {
		return this._complement;
	}
	public get neighborhood(): string | undefined {
		return this._neighborhood;
	}
	public get zipCode(): string | undefined {
		return this._zipCode;
	}
}
