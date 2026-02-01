import { TokenBlackList } from "../../core/application/services";

interface RevokedToken {
    tokenId: string;
    expiresAt: number;
}

export class InMemoryTokenBlacklist implements TokenBlackList {
    private revokedTokens: Map<string, RevokedToken> = new Map();

    async isRevoked(tokenId: bigint | string): Promise<boolean> {
        const key = tokenId.toString();
        const token = this.revokedTokens.get(key);

        if (!token) return false;

        if (Date.now() > token.expiresAt) {
            this.revokedTokens.delete(key);
            return false;
        }

        return true;
    }

    async revoke(tokenId: bigint | string, expiresAt: Date): Promise<void> {
        const key = tokenId.toString();
        const ttl = expiresAt.getTime();

        if (ttl <= Date.now()) return;

        this.revokedTokens.set(key, { tokenId: key, expiresAt: ttl });
    }
}
