export const PaymentMethod = Object.freeze({
	CREDIT_CARD: 1,
	DEBIT_CARD: 2,
	PIX: 3,
	CASH: 4,
	OTHER: 5,
} as const);

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
