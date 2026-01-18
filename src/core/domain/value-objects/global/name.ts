import { BusinessRuleViolationError } from "../../errors";

export class Name {
	private readonly _value: string;

	private constructor(value: string) {
		this._value = value;
		Object.freeze(this);
	}

	public static create(value: string): Name {
		this.isValid(value);
		return new Name(value);
	}

	private static isValid(value: string): void {
		const MAX_QUANTITY_OF_PERMITTED_CHARACTERS = 100;

		if (!value)
			throw new BusinessRuleViolationError("Nome não pode ser vazio", 422);
		if (value.length < 2 || value.length > MAX_QUANTITY_OF_PERMITTED_CHARACTERS) {
			throw new BusinessRuleViolationError(
				"Nome deve ter entre 2 e 100 caracteres",
				422,
			);
		}
	}

	public get value(): string {
		return this._value;
	}
}
