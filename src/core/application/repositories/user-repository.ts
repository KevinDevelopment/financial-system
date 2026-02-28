import { User } from "../../domain/entities/user";
import { UserProps } from "../../domain/props";
import { PaginatedResult } from "../shared";

export interface UserRepository {
	create(user: User): Promise<void>;
	findByEmail(email: string): Promise<User | null>;
	findById(id: bigint): Promise<User | null>;
	getUsers(
		organizationId: bigint,
		page?: number,
		perPage?: number,
	): Promise<PaginatedResult<UserProps>>;
}
