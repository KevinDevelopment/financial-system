import { AuthContext } from "../types";
import { Role } from "../../domain/entities/user/role";

export class TransactionPolicy {
    static canCreate(auth: AuthContext): boolean {
        return auth.role === Role.ADMIN
    }

    static canView(auth: AuthContext): boolean {
        return auth.role === Role.ADMIN;
    }
}