import { Organization } from "../../core/entities";
import { OrganizationRepository } from "../../core/repositories";

export class InMemoryOrganizationAdapter implements OrganizationRepository {
	private readonly databaseInMemory: Array<Organization> = [];

	async create(organization: Organization): Promise<void> {
		this.databaseInMemory.push(organization);
	}

	async findByCnpj(cnpj: string): Promise<Organization | null> {
		const organizationExistsByCnpj = this.databaseInMemory.find(
			(org) => org.cnpj.value === cnpj,
		);
		if (!organizationExistsByCnpj) return null;
		return organizationExistsByCnpj;
	}

	async findByName(name: string): Promise<Organization | null> {
		const organizationExistsByName = this.databaseInMemory.find(
			(org) => org.name === name,
		);
		if (!organizationExistsByName) return null;
		return organizationExistsByName;
	}
}
