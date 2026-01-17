import { AplicationError } from ".";

export class DataAlreadyExistsError extends AplicationError {
	constructor(message: string, status: number) {
		super(message, status);
	}
}
