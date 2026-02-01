import { TokenCache } from "../../core/application/services";
import { RedisConnection } from "../config/redis";

export class RedisTokenCache implements TokenCache {
	async has(tokenId: bigint | string): Promise<boolean> {
		const key = this.getKey(tokenId);
		const exists = await RedisConnection.exists(key);
		return exists === 1;
	}

	async add(tokenId: bigint | string, expiresAt: Date): Promise<void> {
		const ttlInSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
		if (ttlInSeconds <= 0) return;
		const key = this.getKey(tokenId);
		await RedisConnection.set(key, "1", { EX: ttlInSeconds });
	}

	async remove(tokenId: bigint | string): Promise<void> {
		const key = this.getKey(tokenId);
		await RedisConnection.del(key);
	}

	private getKey(tokenId: bigint | string) {
		return `refresh:valid:${tokenId.toString()}`;
	}
}
