import { TokenCache } from "../../core/application/services";

export class InMemoryTokenCache implements TokenCache {
	private validTokens = new Map<string, number>();

	async has(tokenId: bigint | string): Promise<boolean> {
		const key = tokenId.toString();
		const exp = this.validTokens.get(key);
		if (!exp) return false;

		if (Date.now() > exp) {
			this.validTokens.delete(key);
			return false;
		}

		return true;
	}

	async add(tokenId: bigint | string, expiresAt: Date): Promise<void> {
		const key = tokenId.toString();
		if (expiresAt.getTime() <= Date.now()) return;
		this.validTokens.set(key, expiresAt.getTime());
	}

	async remove(tokenId: bigint | string): Promise<void> {
		const key = tokenId.toString();
		this.validTokens.delete(key);
	}
}
