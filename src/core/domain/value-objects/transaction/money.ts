import { BusinessRuleViolationError } from "../../errors";

export class Money {
    private constructor(private readonly cents: number) {
        Object.freeze(this);
    }

    static create(value: number | string): Money {
        const num =
            typeof value === "string"
                ? Number(value.replace(",", "."))
                : value;

        if (Number.isNaN(num)) {
            throw new BusinessRuleViolationError("Valor monetário inválido", 422);
        }

        return new Money(Math.round(num * 100));
    }

    static fromCents(cents: number): Money {
        if (!Number.isSafeInteger(cents)) {
            throw new BusinessRuleViolationError("Valor monetário inválido", 422);
        }

        return new Money(cents);
    }

    plus(other: Money): Money {
        return new Money(this.cents + other.cents);
    }

    minus(other: Money): Money {
        return new Money(this.cents - other.cents);
    }

    isPositive(): boolean {
        return this.cents > 0;
    }

    isNegative(): boolean {
        return this.cents < 0;
    }

    isZero(): boolean {
        return this.cents === 0;
    }

    toCents(): number {
        return this.cents;
    }

    toDecimal(): number {
        return this.cents / 100;
    }
}
