import { AplicationError } from ".";

export class MissingDataError extends AplicationError {
	constructor(message: string, status: number) {
		super(message, status);
	}
}
