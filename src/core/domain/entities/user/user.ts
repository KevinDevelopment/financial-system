import { UniqueNumericId, OrganizationId } from "../../value-objects/global";
import { Email, Name, PasswordHash } from "../../value-objects/user";
import { UserProps } from "../../props";
import { Role } from "../../value-objects/user";

export class User {
	private constructor(
		private readonly _name: Name,
		private readonly _email: Email,
		private readonly _role: Role,
		private readonly _passwordHash: PasswordHash,
		private readonly _organizationId: OrganizationId,
		private readonly _id?: UniqueNumericId,
	) {}

	public static create(props: UserProps): User {
		const { id, name, email, role, passwordHash, organizationId } = props;

		const uniqueId = id ? UniqueNumericId.create(id) : UniqueNumericId.create();
		const nameInstance = Name.create(name);
		const emailInstance = Email.create(email);
		const roleInstance = Role.create(role);
		const organizationInstance = OrganizationId.create(organizationId);
		const passwordInstance = PasswordHash.create(passwordHash);

		return new User(
			nameInstance,
			emailInstance,
			roleInstance,
			passwordInstance,
			organizationInstance,
			uniqueId,
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

	public get passwordHash(): PasswordHash {
		return this._passwordHash;
	}

	public get organizationId(): OrganizationId {
		return this._organizationId;
	}
}
