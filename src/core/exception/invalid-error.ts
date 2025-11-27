import { AplicationError } from "./";

export class InvalidValueError extends AplicationError {
	constructor(message: string, status: number) {
		super(message, status);
	}
}
