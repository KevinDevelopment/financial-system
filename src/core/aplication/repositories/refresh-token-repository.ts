import { RefreshToken } from "../../domain/entities/refresh-token";

export interface RefreshTokenRepository {
	create(token: RefreshToken): Promise<void>;
}
