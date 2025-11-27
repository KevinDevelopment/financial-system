import { AplicationError } from "./aplication-error";

export class BusinessRuleViolationError extends AplicationError {
	constructor(message: string, status: number) {
		super(message, status);
	}
}
