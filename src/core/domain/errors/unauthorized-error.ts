import { AplicationError } from ".";

export class UnauthorizedError extends AplicationError {
    constructor(message: string, status: number) {
        super(message, status);
    }
}
