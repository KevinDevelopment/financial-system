import { BusinessRuleViolationError } from "../../exception";

export class Color {
	private readonly _value: string;

	private constructor(value: string) {
		this._value = value;
		Object.freeze(this);
	}

	public static create(value: string): Color {
		if (!this.isValid(value)) {
			throw new BusinessRuleViolationError(`Cor da tag inválida: ${value}`, 422);
		}
		return new Color(value);
	}

	private static isValid(value: string): boolean {
		return this.isHex(value) || this.isRGBA(value) || this.isNamedColor(value);
	}

	private static isHex(value: string): boolean {
		return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(value);
	}

	private static isRGBA(value: string): boolean {
		return /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|0?\.\d+|1)\s*\)$/.test(value);
	}

	private static isNamedColor(value: string): boolean {
		const namedColors = new Set([
			"red",
			"blue",
			"green",
			"yellow",
			"black",
			"white",
			"gray",
			"purple",
			"orange",
			"pink",
			"brown",
			"cyan",
			"magenta",
			"lime",
			"navy",
			"teal",
			"olive",
			"maroon",
			"silver",
			"gold",
			"transparent",
		]);
		return namedColors.has(value.toLowerCase());
	}

	public get value(): string {
		return this._value;
	}
}