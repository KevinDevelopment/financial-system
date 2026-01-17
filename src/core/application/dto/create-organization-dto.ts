export interface CreateOrganizationInputDto {
	name: string;
	cnpj: string;
	socialReason?: string;
	phone?: string;
	address?: {
		street: string;
		city: string;
		state: string;
		country: string;
		number?: number;
		complement?: string;
		neighborhood?: string;
		zipCode?: string;
	};
}

export interface CreateOrganizationOutputDto {
	id: bigint;
}
