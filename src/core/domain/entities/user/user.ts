import {
	UniqueNumericId,
	OrganizationId,
	Name,
} from "../../value-objects/global";
import { BusinessRuleViolationError } from "../../errors";
import { Email, PasswordHash } from "../../value-objects/user";
import { UserProps } from "../../props";
import { Role } from "../../value-objects/user";

export class User {
	private constructor(
		private readonly _name: Name,
		private readonly _email: Email,
		private readonly _role: Role,
		private readonly _organizationId: OrganizationId,
		private readonly _passwordHash?: PasswordHash,
		private readonly _id?: UniqueNumericId,
	) {}

	public static create(props: UserProps): User {
		const { id, name, email, role, passwordHash, organizationId } = props;

		return new User(
			Name.create(name),
			Email.create(email),
			Role.create(role),
			OrganizationId.create(organizationId),
			passwordHash ? PasswordHash.create(passwordHash) : undefined,
			id ? UniqueNumericId.create(id) : UniqueNumericId.create(),
		);
	}

	public get id(): UniqueNumericId {
		return this._id;
	}

	public get name(): Name {
		return this._name;
	}

	public get email(): Email {
		return this._email;
	}

	public get role(): Role {
		return this._role;
	}

	public get passwordHash(): PasswordHash | undefined {
		return this._passwordHash;
	}

	public get organizationId(): OrganizationId {
		return this._organizationId;
	}

	public toProps(): UserProps {
		return {
			id: this._id.value,
			name: this._name.value,
			email: this._email.value,
			organizationId: this._organizationId.value,
			role: this._role.type,
			passwordHash: this._passwordHash ? this._passwordHash.value : undefined,
		};
	}

	public definePassword(passwordHash: string): User {
		if (this._passwordHash) {
			throw new BusinessRuleViolationError(
				"Usuário já possui senha definida",
				422,
			);
		}

		return User.create({
			...this.toProps(),
			passwordHash,
		});
	}
}
