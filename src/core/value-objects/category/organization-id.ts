import { BusinessRuleViolationError } from "../../exception";

export class OrganizationId {
    private constructor(
        private readonly _value: bigint
    ) { }

    public static create(value: unknown): OrganizationId {
        if (value === null || value === undefined) {
            throw new BusinessRuleViolationError(
                "Obrigatório informar a organização ao qual a categoria pertence",
                422
            );
        }

        if (typeof value !== "bigint") {
            throw new BusinessRuleViolationError(
                "OrganizationId deve ser um bigint válido",
                422
            );
        }

        if (value <= 0n) {
            throw new BusinessRuleViolationError(
                "OrganizationId inválido",
                422
            );
        }

        return new OrganizationId(value);
    }

    get value(): bigint {
        return this._value;
    }
}
