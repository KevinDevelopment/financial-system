export const TransactionType = Object.freeze({
	INCOME: 1,
	EXPENSE: 2,
} as const);

export type TransactionType =
	(typeof TransactionType)[keyof typeof TransactionType];
