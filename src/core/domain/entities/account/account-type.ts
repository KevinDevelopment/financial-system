export const AccountType = Object.freeze({
	CHECKING: 1,
	SAVINGS: 2,
	DIGITAL_WALLET: 3,
} as const);

export type AccountType = (typeof AccountType)[keyof typeof AccountType];
