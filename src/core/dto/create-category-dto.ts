export interface CreateCategoryInputDto {
	organizationId: bigint;
	name: string;
	color: string;
	description?: string;
}

export interface CreateCategoryOutputDto {
	id: bigint;
	name: string;
	color: string;
	description?: string;
}
