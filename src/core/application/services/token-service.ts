import { TokenType } from "../types";

export interface TokenService {
	generate(type: TokenType, payload: object): Promise<string>;

	verify<TPayload>(
		type: TokenType,
		token: string,
	): Promise<TPayload>;
}
