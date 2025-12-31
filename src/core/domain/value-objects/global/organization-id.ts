import { BusinessRuleViolationError } from "../../errors";

export class OrganizationId {
	private constructor(private readonly _value: bigint) {
		Object.freeze(this);
	}

	public static create(value: unknown): OrganizationId {
		const parsed = OrganizationId.parse(value);

		if (parsed <= 0n) {
			throw new BusinessRuleViolationError("OrganizationId inválido", 422);
		}

		return new OrganizationId(parsed);
	}

	private static parse(value: unknown): bigint {
		if (value === null || value === undefined) {
			throw new BusinessRuleViolationError(
				"Obrigatório informar a organização",
				422,
			);
		}

		if (typeof value === "bigint") {
			return value;
		}

		if (typeof value === "number") {
			if (!Number.isInteger(value)) {
				throw new BusinessRuleViolationError(
					"OrganizationId deve ser um número inteiro",
					422,
				);
			}
			return BigInt(value);
		}

		if (typeof value === "string") {
			if (!/^\d+$/.test(value)) {
				throw new BusinessRuleViolationError(
					"OrganizationId deve ser um número inteiro válido",
					422,
				);
			}
			return BigInt(value);
		}

		throw new BusinessRuleViolationError("OrganizationId inválido", 422);
	}

	get value(): bigint {
		return this._value;
	}
}
