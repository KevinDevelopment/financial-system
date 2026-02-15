import { AuthContext } from "../types";

export interface CreateUserInputDto {
	name: string;
	email: string;
	password: string;
	auth: AuthContext
}

export interface CreateUserOutputDto {
	id: bigint;
	name: string;
	email: string;
}
