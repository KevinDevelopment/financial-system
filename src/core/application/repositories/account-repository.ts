import { Account } from "../../domain/entities/account";
import { AccountProps } from "../../domain/props";
import { PaginatedResult } from "../shared";

export interface AccountRepository {
	create(account: Account): Promise<void>;
	update(account: Account): Promise<void>;
	findByName(name: string, userId: bigint): Promise<Account | null>;
	findById(accountId: bigint): Promise<Account | null>;
	getAccounts(organizationId: bigint, page?: number, perPage?: number): Promise<PaginatedResult<AccountProps>>;
}
