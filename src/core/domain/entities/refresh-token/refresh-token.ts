import { UniqueNumericId, OrganizationId } from "../../value-objects/global";
import { UserId } from "../../value-objects/refresh-token";

export class RefreshToken {
    private constructor(
        readonly userId: UserId,
        readonly organizationId: OrganizationId,
        readonly expiresAt: Date,
        readonly revokedAt?: Date,
        readonly id?: UniqueNumericId,
    ) { }

    static create(props: {
        id?: bigint;
        userId: bigint;
        organizationId: bigint;
        expiresAt?: Date;
        revokedAt?: Date;
    }): RefreshToken {
        return new RefreshToken(
            UserId.create(props.userId),
            OrganizationId.create(props.organizationId),
            props.expiresAt ?? RefreshToken.defaultExpiration(),
            props.revokedAt,
            props.id ? UniqueNumericId.create(props.id) : UniqueNumericId.create(),
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
