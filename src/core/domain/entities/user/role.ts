export const Role = Object.freeze({
	ADMIN: 2,
	USER: 3,
} as const);

export type Role = (typeof Role)[keyof typeof Role];
