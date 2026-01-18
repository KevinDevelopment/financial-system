import {
	UniqueNumericId,
	OrganizationId,
	UserId,
} from "../../value-objects/global";
import { AccountType, Money } from "../../value-objects/account";
import { AccountProps } from "../../props";
import { Name } from "../../value-objects/global";

export class Account {
	private constructor(
		private readonly _name: Name,
		private readonly _type: AccountType,
		private readonly _initialBalance: Money,
		private readonly _currentBalance: Money,
		private readonly _organizationId: OrganizationId,
		private readonly _userId: UserId,
		private readonly _id?: UniqueNumericId,
	) {}

	public static create(props: AccountProps) {
		const {
			name,
			type,
			initialBalance,
			currentBalance,
			organizationId,
			userId,
			id,
		} = props;

		return new Account(
			Name.create(name),
			AccountType.create(type),
			Money.create(initialBalance),
			Money.create(currentBalance),
			OrganizationId.create(organizationId),
			UserId.create(userId),
			id ? UniqueNumericId.create(id) : UniqueNumericId.create(),
		);
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
