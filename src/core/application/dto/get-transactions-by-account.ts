import { TransactionProps } from "../../domain/props";
import { PaginationType } from "../shared";
import { AuthContext } from "../types";

export interface GetTransactionsByAccountInputDto {
	accountId: bigint;
	auth: AuthContext,
	page?: number;
	perPage?: number;
}

export interface GetTransactionsByAccountOutputDto {
	transactions: TransactionProps[];
	metadata: PaginationType;
}
