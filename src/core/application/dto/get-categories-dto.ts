import { CategoryProps } from "../../domain/props";
import { PaginationType } from "../shared";

export interface GetCategoriesInputDto {
	organizationId: bigint;
	page?: number;
	perPage?: number;
}

export interface GetCategoriesOutputDto {
	categories: CategoryProps[];
	metadata: PaginationType;
}
