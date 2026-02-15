import { config } from "../config";
import jwt from "jsonwebtoken";
import { TokenService } from "../../core/application/services";
import { Serializer } from "../../core/application/shared";
import { TokenType } from "../../core/application/types";

export class TokenServiceAdapter implements TokenService {
	async generate(type: TokenType, payload: object): Promise<string> {
		const expiresIn = type === TokenType.ACCESS ? "15m" : "8d";
		const secret =
			type === TokenType.ACCESS
				? config.accessTokenSecret
				: config.refreshTokenSecret;

		const safePayload = Serializer.safeJson(payload);

		return jwt.sign(safePayload, secret!, {
			expiresIn,
			algorithm: config.tokenAlgorithm as jwt.Algorithm,
		});
	}

	async verify<TPayload>(type: TokenType, token: string): Promise<TPayload> {
		const secret =
			type === TokenType.ACCESS
				? config.accessTokenSecret
				: config.refreshTokenSecret;

		return jwt.verify(token, secret) as TPayload;
	}
}
