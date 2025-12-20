import { OrganizationRepository } from "../repositories";
import {
	CreateOrganizationInputDto,
	CreateOrganizationOutputDto,
} from "../dto";
import { DataAlreadyExistsError } from "../exception";
import { Organization } from "../entities";

export class CreateOrganizationUseCase {
	constructor(
		private readonly organizationRepository: OrganizationRepository,
	) {}

	async perform(
		input: CreateOrganizationInputDto,
	): Promise<CreateOrganizationOutputDto> {
		const organization = Organization.create(input);

		const cnpjAlreadyExists = await this.organizationRepository.findByCnpj(
			organization.cnpj.value,
		);

		if (cnpjAlreadyExists) {
			throw new DataAlreadyExistsError(
				"Ja existe uma organização com este CNPJ",
				409,
			);
		}

		const nameAlreadyExists = await this.organizationRepository.findByName(
			organization.name.value,
		);

		if (nameAlreadyExists) {
			throw new DataAlreadyExistsError(
				"Ja existe uma organização com este nome",
				409,
			);
		}

		await this.organizationRepository.create(organization);

		return { id: organization.id.value };
	}
}
