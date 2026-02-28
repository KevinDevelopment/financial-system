import { UserProps } from "../../domain/props";
import { PaginationType } from "../shared";

export interface GetUsersInputDto {
	organizationId: bigint;
	page?: number;
	perPage?: number;
}

export interface GetUsersOutputDto {
	users: UserProps[];
	metadata: PaginationType;
}
