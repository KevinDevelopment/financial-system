import { AccountProps } from "../../domain/props";
import { PaginationType } from "../shared";

export interface GetAccountsInputDto {
	organizationId: bigint;
	page?: number;
	perPage?: number;
}

export interface GetAccountsOutputDto {
	accounts: AccountProps[];
	metadata: PaginationType;
}
