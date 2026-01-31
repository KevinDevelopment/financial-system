import { User } from "../../domain/entities/user";

export interface UserRepository {
	create(user: User): Promise<void>;
	findByEmail(email: string): Promise<User | null>;
	findById(id: bigint): Promise<User | null>;
}
