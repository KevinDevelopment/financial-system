import { BusinessRuleViolationError } from "../../errors";
import { PaymentMethod as Payment } from "../../entities/transaction/payment-method";

export class PaymentMethod {
	private readonly _value: number;

	private constructor(value: Payment) {
		this._value = value;
		Object.freeze(this);
	}

	public static create(value: number): PaymentMethod {
		if (!PaymentMethod.isValid(value)) {
			throw new BusinessRuleViolationError("método de pagamento inválido", 422);
		}

		return new PaymentMethod(value);
	}

	private static isValid(value: number): value is Payment {
		return (
			value === Payment.CREDIT_CARD ||
			value === Payment.DEBIT_CARD ||
			value === Payment.PIX ||
			value === Payment.CASH ||
			value === Payment.OTHER
		);
	}

	get value(): number {
		return this._value;
	}
}
