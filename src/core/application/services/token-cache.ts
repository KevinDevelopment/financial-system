export interface TokenCache {
    has(tokenId: bigint): Promise<boolean>;
    add(tokenId: bigint, expiresAt: Date): Promise<void>;
    remove(tokenId: bigint): Promise<void>;
}
