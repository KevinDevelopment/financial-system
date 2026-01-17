import { BusinessRuleViolationError } from "../../errors";

export class Email {
	private readonly _email: string;

	private constructor(email: string) {
		this._email = email.trim().toLowerCase();
		Object.freeze(this);
	}

	public static create(email: unknown): Email {
		if (typeof email !== "string") {
			throw new BusinessRuleViolationError("Email inválido", 422);
		}

		Email.validate(email);
		return new Email(email);
	}

	private static validate(email: string): void {
		if (!email || !email.trim()) {
			throw new BusinessRuleViolationError("Email não pode ser vazio", 422);
		}

		const normalized = email.trim().toLowerCase();
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!regex.test(normalized)) {
			throw new BusinessRuleViolationError("Email inválido", 422);
		}
	}

	public get value(): string {
		return this._email;
	}
}
