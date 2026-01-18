import { Account } from "../../core/domain/entities/account";

export const accountMapper = {
	toPersistence(account: Account) {
		return {
			id: account.id.value,
			name: account.name.value,
			type: account.type.value,
		};
	},
};
