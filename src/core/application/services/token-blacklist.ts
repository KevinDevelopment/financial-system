export interface TokenBlackList {
    isRevoked(tokenId: bigint): Promise<boolean>;
    revoke(tokenId: bigint, expiresAt: Date): Promise<void>;
}