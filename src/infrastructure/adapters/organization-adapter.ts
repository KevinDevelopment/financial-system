import { Organization } from "../../core/entities";
import { OrganizationRepository } from "../../core/repositories";
import { UniqueNumericId } from "../../core/value-objects/organization"
import { prisma } from "../config";
import { organizationMapper } from "../mappers/organization-mapper";

export class OrganizationAdapter implements OrganizationRepository {
    async create(organization: Organization): Promise<void> {
        const data = organizationMapper.toPersistence(organization);

        await prisma.$transaction(async (tx) => {
            let addressId: bigint | undefined;

            if (data.address) {
                const id = UniqueNumericId.create().value;

                await tx.address.create({
                    data: {
                        id,
                        ...data.address
                    }
                });

                addressId = id;
            }

            await tx.organization.create({
                data: {
                    id: data.id,
                    name: data.name.value,
                    socialReason: data.socialReason,
                    phone: data.phone,
                    cnpj: data.cnpj,
                    addressId
                }
            });
        });
    }

    private async findUnique(where: any): Promise<Organization | null> {
        const row = await prisma.organization.findFirst({
            where,
            include: { address: true }
        });

        if (!row) return null;

        return organizationMapper.toDomain(row);
    }

    async findByName(name: string): Promise<Organization | null> {
        return this.findUnique({ name });
    }

    async findByCnpj(cnpj: string): Promise<Organization | null> {
        return this.findUnique({ cnpj });
    }
}
