import jwt from "jsonwebtoken";
import { TokenService } from "../../core/application/services";
import { Serializer } from "../../core/application/shared";
import { TokenType } from "../../core/application/types";

export class TokenServiceAdapter implements TokenService {
	async generate(type: TokenType, payload: object): Promise<string> {
		const expiresIn = type === TokenType.ACCESS ? "15m" : "30d";
		const secret =
			type === TokenType.ACCESS
				? process.env.ACCESS_TOKEN_SECRET
				: process.env.REFRESH_TOKEN_SECRET;

		const safePayload = Serializer.safeJson(payload);

		return jwt.sign(safePayload, secret!, {
			expiresIn,
			algorithm: process.env.TOKEN_ALGORITHM as jwt.Algorithm,
		});
	}

	async verify<TPayload>(
		type: TokenType,
		token: string,
	): Promise<TPayload> {
		const secret =
			type === TokenType.ACCESS
				? process.env.ACCESS_TOKEN_SECRET
				: process.env.REFRESH_TOKEN_SECRET;

		console.log(jwt.verify(token, secret) as TPayload)
		return jwt.verify(token, secret) as TPayload;
	}
}
