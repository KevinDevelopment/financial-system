import { PaginationMetadataBuilder } from "../../core/application/services";
import { PaginationType } from "../../core/application/shared";

export class PaginationMetadataAdapter implements PaginationMetadataBuilder {
	private readonly MAX_PER_PAGE = 50;

	build(params: {
		page: number;
		perPage: number;
		total: number;
		count: number;
	}): PaginationType {
		const page = this.normalizePage(params.page);
		const perPage = this.normalizePerPage(params.perPage);
		const total = params.total;
		const count = params.count;

		const totalPages = total > 0 ? Math.ceil(total / perPage) : 1;

		return {
			total,
			count,
			perPage,
			currentPage: page,
			totalPages,
		};
	}

	private normalizePage(page?: number): number {
		return page && page > 0 ? Math.floor(page) : 1;
	}

	private normalizePerPage(perPage?: number): number {
		if (!perPage || perPage < 1) return 50;
		return perPage > this.MAX_PER_PAGE
			? this.MAX_PER_PAGE
			: Math.floor(perPage);
	}
}
