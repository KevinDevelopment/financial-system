import { UniqueNumericId } from "../../value-objects/global";
import { Email, Name, PasswordHash } from "../../value-objects/user";
import { UserProps } from "../../props";
import { Role } from "../../value-objects/user";

export class User {
    private constructor(
        private readonly _name: Name,
        private readonly _email: Email,
        private readonly _role: Role,
        private readonly _password: PasswordHash,
        private readonly _id?: UniqueNumericId
    ) { }

    public static create(props: UserProps): User {
        const { id, name, email, role, password } = props;

        const uniqueId = id ? UniqueNumericId.create(id) : UniqueNumericId.create();
        const nameInstance = Name.create(name);
        const emailInstance = Email.create(email);
        const roleInstance = Role.create(role);
        const passwordInstance = PasswordHash.create(password);

        return new User(
            nameInstance,
            emailInstance,
            roleInstance,
            passwordInstance,
            uniqueId
        )
    }

    public get id(): UniqueNumericId {
        return this._id
    }

    public get name(): Name {
        return this._name
    }

    public get email(): Email {
        return this._email
    }

    public get role(): Role {
        return this._role
    }
}