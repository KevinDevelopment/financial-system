import { AuthContext } from "../types/auth-context-type";

export interface CreateTransactionInputDto {
	accountId: bigint;
	amount: number;
	type: number;
	status: number;
	paymentMethod: number;
	categoryId?: bigint;
	description?: string;
	auth: AuthContext
}

export interface CreateTransactionOutputDto {
	id: bigint;
}
