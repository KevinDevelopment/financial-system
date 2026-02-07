import { Account } from "../../core/domain/entities/account";
import { AccountRepository } from "../../core/application/repositories";
import { PaginatedResult } from "../../core/application/shared";
import { AccountProps } from "../../core/domain/props";

export class InMemoryAccountAdapter implements AccountRepository {
	private readonly databaseInMemory: Array<Account> = [];

	async create(account: Account): Promise<void> {
		this.databaseInMemory.push(account);
	}

	async update(account: Account): Promise<void> {
		const index = this.databaseInMemory.findIndex(
			(acc) => acc.id.value === account.id.value,
		);
		if (index !== -1) {
			this.databaseInMemory[index] = account;
		}
	}

	async findByName(name: string, userId: bigint): Promise<Account | null> {
		const accountExistsByName = this.databaseInMemory.find(
			(account) =>
				account.name.value === name && account.userId.value === userId,
		);
		if (!accountExistsByName) return null;
		return accountExistsByName;
	}

	async findById(accountId: bigint): Promise<Account | null> {
		const account = this.databaseInMemory.find(
			(acc) => acc.id.value === accountId,
		);
		if (!account) return null;
		return account;
	}

	async getAccounts(
		organizationId: bigint,
		page: number,
		perPage: number
	): Promise<PaginatedResult<AccountProps>> {

		const filtered = this.databaseInMemory.filter(
			(acc) => acc.organizationId.value === organizationId
		);

		const total = filtered.length;

		const start = (page - 1) * perPage;
		const end = start + perPage;

		const paginated = filtered.slice(start, end);

		const data = paginated.map((account) => ({
			id: account.id.value,
			name: account.name.value,
			type: account.type.value,
			initialBalance: account.initialBalance.toDecimal(),
			currentBalance: account.currentBalance.toDecimal(),
			organizationId: account.organizationId.value,
			userId: account.userId.value
		}));

		return {
			data,
			total
		};
	}
}
