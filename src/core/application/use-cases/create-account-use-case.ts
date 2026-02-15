import { AccountRepository } from "../repositories";
import { CreateAccountInputDto, CreateAccountOutputDto } from "../dto";
import { DataAlreadyExistsError, UnauthorizedError } from "../../domain/errors";
import { Account } from "../../domain/entities/account";
import { AccountPolicy } from "../policies";

export class CreateAccountUseCase {
	constructor(private readonly accountRepository: AccountRepository) { }

	async perform(input: CreateAccountInputDto): Promise<CreateAccountOutputDto> {
		if (!AccountPolicy.create(input.auth)) {
			throw new UnauthorizedError("Permissão negada", 403)
		}
		
		const account = Account.create({
			...input,
			organizationId: input.auth.organizationId,
			userId: input.auth.userId
		});

		const nameAlreadyExists = await this.accountRepository.findByName(
			account.name.value,
			account.userId.value,
		);

		if (nameAlreadyExists) {
			throw new DataAlreadyExistsError(
				"Ja existe uma conta com este nome para o usuário",
				409,
			);
		}

		await this.accountRepository.create(account);

		return {
			id: account.id.value,
		};
	}
}
