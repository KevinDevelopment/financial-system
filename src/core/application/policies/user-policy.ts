import { AuthContext } from "../types";
import { Role } from "../../domain/entities/user/role";

export class UserPolicy {
	static create(auth: AuthContext): boolean {
		return auth.role === Role.ADMIN;
	}
}
