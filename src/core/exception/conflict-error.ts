import { AplicationError } from "./";

export class ConflictError extends AplicationError {
	constructor(message: string, status: number) {
		super(message, status);
	}
}
