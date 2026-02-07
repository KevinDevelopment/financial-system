import { PaginationType } from "../shared";

export interface PaginationMetadataBuilder {
    build(params: {
        page: number;
        perPage: number;
        total: number;
        count: number;
    }): PaginationType;
}
