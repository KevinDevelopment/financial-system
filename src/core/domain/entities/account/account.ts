import {
	UniqueNumericId,
	OrganizationId,
	UserId,
	Name,
} from "../../value-objects/global";
import { AccountType, Money } from "../../value-objects/account";
import { AccountProps } from "../../props";
import { Transaction } from "../transaction/transaction";
import { TransactionType } from "../../value-objects/transaction";
import { TransactionType as TransactionTypeEnum } from "../../entities/transaction/transaction-type";
import { TransactionStatus as TransactionStatusEnum } from "../../entities/transaction/transaction-status";

export class Account {
	private _currentBalance: Money;

	private constructor(
		private readonly _name: Name,
		private readonly _type: AccountType,
		private readonly _initialBalance: Money,
		currentBalance: Money,
		private readonly _organizationId: OrganizationId,
		private readonly _userId: UserId,
		private readonly _id: UniqueNumericId,
	) {
		this._currentBalance = currentBalance;
	}

	public static create(props: AccountProps): Account {
		return new Account(
			Name.create(props.name),
			AccountType.create(props.type),
			Money.create(props.initialBalance),
			Money.create(props.currentBalance),
			OrganizationId.create(props.organizationId),
			UserId.create(props.userId),
			props.id ? UniqueNumericId.create(props.id) : UniqueNumericId.create(),
		);
	}

	public createTransaction(params: {
		amount: number;
		type: number;
		status: number;
		paymentMethod: number;
		categoryId?: bigint;
		description?: string;
	}) {
		const amount = Money.create(params.amount);
		const transactionType = TransactionType.create(params.type);

		if (params.status === TransactionStatusEnum.PAID) {
			if (transactionType.value === TransactionTypeEnum.EXPENSE) {
				this._currentBalance = this._currentBalance.minus(amount);
			}

			if (transactionType.value === TransactionTypeEnum.INCOME) {
				this._currentBalance = this._currentBalance.plus(amount);
			}
		}

		return Transaction.create({
			userId: this._userId.value,
			accountId: this._id.value,
			amount: params.amount,
			type: transactionType.value,
			status: params.status,
			paymentMethod: params.paymentMethod,
			createdAt: new Date(),
			categoryId: params.categoryId,
			description: params.description,
		});
	}

	public get id(): UniqueNumericId {
		return this._id;
	}

	public get name(): Name {
		return this._name;
	}

	public get type(): AccountType {
		return this._type;
	}

	public get initialBalance(): Money {
		return this._initialBalance;
	}

	public get currentBalance(): Money {
		return this._currentBalance;
	}

	public get organizationId(): OrganizationId {
		return this._organizationId;
	}

	public get userId(): UserId {
		return this._userId;
	}
}
