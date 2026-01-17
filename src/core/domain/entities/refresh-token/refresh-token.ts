import { UniqueNumericId, OrganizationId } from "../../value-objects/global";
import { RefreshTokenProps } from "../../props";
import { UserId } from "../../value-objects/global";

export class RefreshToken {
	private constructor(
		readonly userId: UserId,
		readonly organizationId: OrganizationId,
		readonly expiresAt: Date,
		readonly revokedAt?: Date,
		readonly id?: UniqueNumericId,
	) { }

	static create(props: RefreshTokenProps): RefreshToken {
		const { userId, organizationId, expiresAt, revokedAt, id } = props;

		return new RefreshToken(
			UserId.create(userId),
			OrganizationId.create(organizationId),
			expiresAt ?? RefreshToken.defaultExpiration(),
			revokedAt,
			id ? UniqueNumericId.create(id) : UniqueNumericId.create(),
		);
	}

	revoke(): RefreshToken {
		if (this.revokedAt) {
			return this;
		}

		return new RefreshToken(
			this.userId,
			this.organizationId,
			this.expiresAt,
			new Date(),
			this.id,
		);
	}

	isExpired(now = new Date()): boolean {
		return this.expiresAt <= now;
	}

	isRevoked(): boolean {
		return !!this.revokedAt;
	}

	private static defaultExpiration(): Date {
		const date = new Date();
		date.setDate(date.getDate() + 30);
		return date;
	}
}
