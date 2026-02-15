import { UserId, CategoryId, AccountId } from "../../value-objects/global";
import { TransactionProps } from "../../props";
import { UniqueNumericId } from "../../value-objects/global";
import { BusinessRuleViolationError } from "../../errors";
import {
	Money,
	TransactionType,
	TransactionStatus,
	PaymentMethod,
} from "../../value-objects/transaction";

export class Transaction {
	private constructor(
		private readonly _userId: UserId,
		private readonly _accountId: AccountId,
		private readonly _amount: Money,
		private readonly _type: TransactionType,
		private readonly _status: TransactionStatus,
		private readonly _paymentMethod: PaymentMethod,
		private readonly _createdAt: Date,
		private readonly _categoryId?: CategoryId,
		private readonly _description?: string,
		private readonly _id?: UniqueNumericId,
	) {}

	public static create(props: TransactionProps) {
		const {
			userId,
			accountId,
			amount,
			type,
			status,
			paymentMethod,
			createdAt,
			categoryId,
			description,
			id,
		} = props;
		const MAX_QUANTITY_OF_PERMITTED_CHARACTERS = 255;

		if (
			description &&
			description.length > MAX_QUANTITY_OF_PERMITTED_CHARACTERS
		) {
			throw new BusinessRuleViolationError(
				"Descrição não pode exceder 255 caracteres",
				422,
			);
		}

		return new Transaction(
			UserId.create(userId),
			AccountId.create(accountId),
			Money.create(amount),
			TransactionType.create(type),
			TransactionStatus.create(status),
			PaymentMethod.create(paymentMethod),
			createdAt,
			categoryId ? CategoryId.create(categoryId) : undefined,
			description,
			id ? UniqueNumericId.create(id) : UniqueNumericId.create(),
		);
	}

	public toProps(): TransactionProps {
		return {
			userId: this._userId.value,
			accountId: this._accountId.value,
			amount: this._amount.toDecimal(),
			type: this._type.value,
			status: this._status.value,
			paymentMethod: this._paymentMethod.value,
			createdAt: this._createdAt,
			categoryId: this._categoryId ? this._categoryId.value : undefined,
			description: this._description,
			id: this._id ? this._id.value : undefined,
		};
	}

	public get userId(): UserId {
		return this._userId;
	}

	public get accountId(): AccountId {
		return this._accountId;
	}

	public get amount(): Money {
		return this._amount;
	}

	public get type(): TransactionType {
		return this._type;
	}

	public get status(): TransactionStatus {
		return this._status;
	}

	public get paymentMethod(): PaymentMethod {
		return this._paymentMethod;
	}

	public get categoryId(): CategoryId {
		return this._categoryId;
	}

	public get description(): string {
		return this._description;
	}

	public get id(): UniqueNumericId {
		return this._id;
	}

	public get createdAt(): Date {
		return this._createdAt;
	}
}
