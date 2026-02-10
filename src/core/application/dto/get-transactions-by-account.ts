import { TransactionProps } from "../../domain/props"
import { PaginationType } from "../shared"

export interface GetTransactionsByAccountInputDto {
    accountId: bigint;
    page?: number,
    perPage?: number
}

export interface GetTransactionsByAccountOutputDto {
    transactions: TransactionProps[];
    metadata: PaginationType;
}