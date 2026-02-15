import { UserRepository } from "../repositories";
import { CreateUserInputDto, CreateUserOutputDto } from "../dto";
import { DataAlreadyExistsError, UnauthorizedError } from "../../domain/errors";
import { PasswordHasher } from "../services";
import { PasswordStrengthPolicy, UserPolicy } from "../policies";
import { User } from "../../domain/entities/user";

export class CreateUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly passwordHasher: PasswordHasher,
	) { }

	async perform(input: CreateUserInputDto): Promise<CreateUserOutputDto> {
		if (!UserPolicy.create(input.auth)) {
			throw new UnauthorizedError("Permissão negada", 403)
		}

		const user = User.create({
			name: input.name,
			email: input.email,
			role: input.auth.role,
			organizationId: input.auth.organizationId,
		});

		const emailAlreadyExists = await this.userRepository.findByEmail(
			input.email,
		);

		if (emailAlreadyExists) {
			throw new DataAlreadyExistsError(
				"Ja existe um usuário com este email",
				409,
			);
		}

		PasswordStrengthPolicy.validate(input.password);
		const passwordHash = await this.passwordHasher.hash(input.password);
		const userWithPassword = user.definePassword(passwordHash);

		await this.userRepository.create(userWithPassword);

		return {
			id: user.id.value,
			name: user.name.value,
			email: user.email.value,
		};
	}
}
