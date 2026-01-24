export const TransactionStatus = Object.freeze({
	OPEN: 1,
	PAID: 2,
} as const);

export type TransactionStatus =
	(typeof TransactionStatus)[keyof typeof TransactionStatus];
