import { Organization } from "../../core/entities";

export const organizationMapper = {
	toPersistence(organization: Organization) {
		return {
			id: organization.id.value,
			name: organization.name,
			socialReason: organization.socialReason,
			phone: organization.phone,
			cnpj: organization.cnpj.value,
			address: organization.address
				? {
						street: organization.address.street,
						number: organization.address.number,
						complement: organization.address.complement,
						neighborhood: organization.address.neighborhood,
						city: organization.address.city,
						state: organization.address.state,
						country: organization.address.country,
						zipCode: organization.address.zipCode,
					}
				: null,
		};
	},

	toDomain(row: any): Organization {
		return Organization.create({
			id: row.id,
			name: row.name,
			socialReason: row.socialReason,
			phone: row.phone,
			cnpj: row.cnpj,
			address: row.address
				? {
						street: row.address.street,
						number: row.address.number,
						complement: row.address.complement,
						neighborhood: row.address.neighborhood,
						city: row.address.city,
						state: row.address.state,
						country: row.address.country,
						zipCode: row.address.zipCode,
					}
				: null,
		});
	},
};
