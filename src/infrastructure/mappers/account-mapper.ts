import { Account } from "../../core/domain/entities/account";

export const accountMapper = {
	toPersistence(account: Account) {
		return {
			id: account.id.value,
			name: account.name.value,
			type: account.type.value,
			initialBalance: account.initialBalance.toDecimal(),
			currentBalance: account.currentBalance.toDecimal(),
			organizationId: account.organizationId.value,
			userId: account.userId.value,
		};
	},

	toDomain(row: any): Account {
		return Account.create({
			id: row.id,
			name: row.name,
			type: row.type,
			initialBalance: row.initialBalance,
			currentBalance: row.currentBalance,
			organizationId: row.organizationId,
			userId: row.userId,
		});
	},
};
