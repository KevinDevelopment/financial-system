import { AuthContext } from "../types";
import { Role } from "../../domain/entities/user/role";

export class AccountPolicy {
    static create(auth: AuthContext): boolean {
        return auth.role === Role.ADMIN
    }
}