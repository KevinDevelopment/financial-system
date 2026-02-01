export class ValidJwtFormat {
	static check(token: string): boolean {
		const parts = token.split(".");

		if (parts.length !== 3) {
			return false;
		}

		const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
		return parts.every(
			(part) => part.length > 0 && base64UrlPattern.test(part),
		);
	}
}
