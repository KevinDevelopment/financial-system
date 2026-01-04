import { AplicationError } from ".";

export class InvalidCredentialsError extends AplicationError {
    constructor(message: string, status: number) {
        super(message, status);
    }
}
