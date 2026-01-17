import { AccountRepository } from "../repositories";
import { CreateAccountInputDto, CreateAccountOutputDto } from "../dto";
import { DataAlreadyExistsError } from "../../domain/errors";
import { Account } from "../../domain/entities/account";

export class CreateAccountUseCase {
    constructor(private readonly accountRepository: AccountRepository) { }

    async perform(
        input: CreateAccountInputDto,
    ): Promise<CreateAccountOutputDto> {
        const account = Account.create(input);

        const nameAlreadyExists = await this.accountRepository.findByName(
            account.name.value,
            account.userId.value
        );

        if (nameAlreadyExists) {
            throw new DataAlreadyExistsError(
                "Já existe uma conta com este nome para esse usuário",
                409
            );
        }

        await this.accountRepository.create(account);

        return {
            id: account.id.value
        }
    }
}
