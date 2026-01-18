export interface CreateAccountInputDto {
	type: number;
	name: string;
	initialBalance: number;
	currentBalance: number;
	organizationId: unknown;
	userId: unknown;
}

export interface CreateAccountOutputDto {
	id: bigint;
}
