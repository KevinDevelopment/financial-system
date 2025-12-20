export interface CreateCategoryInputDto {
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
