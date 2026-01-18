import { Account } from "../../core/domain/entities/account";
import { AccountRepository } from "../../core/application/repositories";
import { prisma } from "../config";
import { accountMapper } from "../mappers/account-mapper";

export class AccountRepositoryAdapter implements AccountRepository {
    async create(account: Account): Promise<void> {
        const data = accountMapper.toPersistence(account);

        await prisma.account.create({
            data: {
                id: data.id,
                name: data.name,
                type: data.type,
                initialBalance: data.initialBalance,
                currentBalance: data.currentBalance,
                organizationId: data.organizationId,
                userId: data.userId
            }
        });
    }

    async findByName(name: string, userId: bigint): Promise<Account | null> {
        const account = await prisma.account.findFirst({
            where: {
                name,
                userId
            }
        });

        if (!account) return null;

        return accountMapper.toDomain(account);
    }
}