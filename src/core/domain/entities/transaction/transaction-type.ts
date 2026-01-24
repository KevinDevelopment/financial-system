export const TransactionType = Object.freeze({
	EXPENSE: 1,
	INCOME: 2,
} as const);

export type TransactionType =
	(typeof TransactionType)[keyof typeof TransactionType];
