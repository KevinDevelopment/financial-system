import { Account } from "../../core/domain/entities/account";
import { AccountRepository } from "../../core/application/repositories";

export class InMemoryAccountAdapter implements AccountRepository {
    private readonly databaseInMemory: Array<Account> = [];

    async create(account: Account): Promise<void> {
        this.databaseInMemory.push(account);
    }

    async findByName(name: string, userId: bigint): Promise<Account | null> {
        const accountExistsByName = this.databaseInMemory.find(
            (account) =>
                account.name.value === name && account.userId.value === userId,
        );
        if (!accountExistsByName) return null;
        return accountExistsByName;
    }
}
