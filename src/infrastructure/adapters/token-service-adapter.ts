import jwt from "jsonwebtoken";
import { TokenService } from "../../core/aplication/services";

export class TokenServiceAdapter implements TokenService {
    private serializeBigInt(obj: object): object {
        return JSON.parse(
            JSON.stringify(obj, (_, value) => (typeof value === "bigint" ? value.toString() : value))
        );
    }

    async generate(type: "access" | "refresh", payload: object): Promise<string> {
        const expiresIn = type === "access" ? "15m" : "30d";
        const secret =
            type === "access"
                ? process.env.ACCESS_TOKEN_SECRET
                : process.env.REFRESH_TOKEN_SECRET;

        const safePayload = this.serializeBigInt(payload);

        return jwt.sign(safePayload, secret!, { expiresIn, algorithm: "HS256" });
    }

    async verify<TPayload>(type: "access" | "refresh", token: string): Promise<TPayload> {
        const secret =
            type === "access"
                ? process.env.ACCESS_TOKEN_SECRET
                : process.env.REFRESH_TOKEN_SECRET;

        return jwt.verify(token, secret!) as TPayload;
    }
}
