import { Account } from "../../domain/entities/account";

export interface AccountRepository {
    create(account: Account): Promise<void>;
    findByName(name: string, userId: bigint): Promise<Account | null>;
}