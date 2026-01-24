import { UserId, CategoryId } from "../../value-objects/global";
import { TransactionProps } from "../../props";
import { UniqueNumericId } from "../../value-objects/global";
import { BusinessRuleViolationError } from "../../errors";
import { Money, TransactionType, TransactionStatus, PaymentMethod } from "../../value-objects/transaction";

export class Transaction {
    private constructor(
        private readonly _userId: UserId,
        private readonly _ammount: Money,
        private readonly _type: TransactionType,
        private readonly _status: TransactionStatus,
        private readonly _paymentMethod: PaymentMethod,
        private readonly _categoryId?: CategoryId,
        private readonly _description?: string,
        private readonly _id?: UniqueNumericId
    ) { }

    public static create(props: TransactionProps) {
        const {
            userId,
            ammount,
            type,
            status,
            paymentMethod,
            categoryId,
            description,
            id
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
            Money.create(ammount),
            TransactionType.create(type),
            TransactionStatus.create(status),
            PaymentMethod.create(paymentMethod),
            categoryId ? CategoryId.create(categoryId) : undefined,
            description,
            id ? UniqueNumericId.create(id) : UniqueNumericId.create()
        )
    }

    public get userId(): UserId {
        return this._userId
    }

    public get ammount(): Money {
        return this._ammount
    }

    public get type(): TransactionType {
        return this._type
    }

    public get status(): TransactionStatus {
        return this._status
    }

    public get paymentMethod(): PaymentMethod {
        return this._paymentMethod
    }

    public get categoryId(): CategoryId {
        return this._categoryId
    }

    public get description(): string {
        return this._description
    }

    public get id(): UniqueNumericId {
        return this._id
    }
}