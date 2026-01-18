import { TokenService } from "../services";
import { VerifyTokenInputDto, VerifyTokenOutputDto } from "../dto";
import { MissingDataError, InvalidValueError } from "../../domain/errors";

export class VerifyTokenUseCase {
	constructor(private readonly tokenService: TokenService) {}

	async perform(input: VerifyTokenInputDto): Promise<VerifyTokenOutputDto> {
		if (!input.token) {
			throw new MissingDataError("Token de acesso não informado", 401);
		}

		if (typeof input.token !== "string") {
			throw new InvalidValueError("Token de acesso inválido", 401);
		}

		if (input.token.match(/\s/g)) {
			throw new InvalidValueError("Token de acesso inválido", 401);
		}

		try {
			const { sub, organizationId, role } =
				await this.tokenService.verify<VerifyTokenOutputDto>(
					"access",
					input.token.trim(),
				);

			return {
				sub,
				organizationId,
				role,
			};
		} catch (error) {
			throw new InvalidValueError("Token inválido ou expirado", 401);
		}
	}
}
