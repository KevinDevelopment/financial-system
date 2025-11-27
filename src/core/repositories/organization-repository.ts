import { Organization } from "../entities";

export interface OrganizationRepository {
	create(organization: Organization): Promise<void>;
	findByCnpj(cnpj: string): Promise<Organization | null>;
	findByName(name: string): Promise<Organization | null>;
}
