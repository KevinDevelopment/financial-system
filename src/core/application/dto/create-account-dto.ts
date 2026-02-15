import { AuthContext } from "../types";

export interface CreateAccountInputDto {
	type: number;
	name: string;
	initialBalance: number;
	currentBalance: number;
	auth: AuthContext;
}

export interface CreateAccountOutputDto {
	id: bigint;
}
