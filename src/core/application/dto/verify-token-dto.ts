export interface VerifyTokenInputDto {
	token: string;
}

export interface VerifyTokenOutputDto {
	sub: bigint;
	organizationId: bigint;
	role: number;
}
