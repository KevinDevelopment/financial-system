import { BusinessRuleViolationError } from "../../errors";
import { Role as RoleType } from "../../entities/user/role";

export class Role {
    private readonly _value: RoleType;

    private constructor(value: RoleType) {
        this._value = value;
        Object.freeze(this);
    }

    public static create(value: number): Role {
        if (!Role.isValid(value)) {
            throw new BusinessRuleViolationError("Role inválida", 422);
        }

        return new Role(value);
    }

    private static isValid(value: number): value is RoleType {
        return value === RoleType.MANAGER
            || value === RoleType.ADMIN
            || value === RoleType.USER;
    }

    get type(): RoleType {
        return this._value;
    }

    isAdmin(): boolean {
        return this._value === RoleType.ADMIN;
    }

    isManager(): boolean {
        return this._value === RoleType.MANAGER;
    }
}
