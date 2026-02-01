import { TokenBlackList } from "../../core/application/services";
import { RedisConnection } from "../config/redis";

export class RedisTokenBlacklist implements TokenBlackList {
    async isRevoked(tokenId: bigint | string): Promise<boolean> {
        const key = this.getKey(tokenId);
        const exists = await RedisConnection.exists(key);
        return exists === 1;
    }

    async revoke(tokenId: bigint | string, expiresAt: Date): Promise<void> {
        const ttlInSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
        if (ttlInSeconds <= 0) return;
        const key = this.getKey(tokenId);

        await RedisConnection.set(key, "1", { EX: ttlInSeconds });
    }

    private getKey(tokenId: bigint | string) {
        return `refresh:revoked:${tokenId.toString()}`;
    }
}
