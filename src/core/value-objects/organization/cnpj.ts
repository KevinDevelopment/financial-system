import { BusinessRuleViolationError } from "../../exception";

export class CNPJ {
	private readonly _value: string;

	private constructor(value: string) {
		this._value = value;
		Object.freeze(this);
	}

	public static create(value: string): CNPJ {
		const cleanCNPJ = this.clean(value);
		if (!this.isValid(cleanCNPJ)) {
			throw new BusinessRuleViolationError(`CNPJ inválido: ${value}`, 422);
		}
		return new CNPJ(cleanCNPJ);
	}

	private static clean(value: string): string {
		return value.replace(/[^\d]/g, "");
	}

	private static isValid(cnpj: string): boolean {
		if (cnpj.length !== 14) return false;
		if (/^(\d)\1{13}$/.test(cnpj)) return false;

		return this.checkDigits(cnpj);
	}

	private static checkDigits(cnpj: string): boolean {
		const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
		const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

		const calculateDigit = (cnpj: string, weights: number[]) => {
			const sum = cnpj
				.split("")
				.slice(0, weights.length)
				.reduce((acc, num, index) => acc + parseInt(num) * weights[index], 0);
			const remainder = sum % 11;
			return remainder < 2 ? 0 : 11 - remainder;
		};

		const firstDigit = calculateDigit(cnpj, weights1);
		const secondDigit = calculateDigit(cnpj, weights2);

		return (
			firstDigit === parseInt(cnpj[12]) && secondDigit === parseInt(cnpj[13])
		);
	}

	public get value(): string {
		return this._value;
	}

	public get formatted(): string {
		return this._value.replace(
			/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
			"$1.$2.$3/$4-$5",
		);
	}
}
