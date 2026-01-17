import jwt from "jsonwebtoken";
import { TokenService } from "../../core/application/services";
import { Serializer } from "../../core/application/shared";

export class TokenServiceAdapter implements TokenService {
	async generate(type: "access" | "refresh", payload: object): Promise<string> {
		const expiresIn = type === "access" ? "15m" : "30d";
		const secret =
			type === "access"
				? process.env.ACCESS_TOKEN_SECRET
				: process.env.REFRESH_TOKEN_SECRET;

		const safePayload = Serializer.safeJson(payload);

		return jwt.sign(safePayload, secret!, {
			expiresIn,
			algorithm: process.env.TOKEN_ALGORITHM as jwt.Algorithm,
		});
	}

	async verify<TPayload>(
		type: "access" | "refresh",
		token: string,
	): Promise<TPayload> {
		const secret =
			type === "access"
				? process.env.ACCESS_TOKEN_SECRET
				: process.env.REFRESH_TOKEN_SECRET;

		console.log(jwt.verify(token, secret) as TPayload)
		return jwt.verify(token, secret) as TPayload;
	}
}
