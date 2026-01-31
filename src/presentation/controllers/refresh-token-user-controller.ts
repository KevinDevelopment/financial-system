import { RefreshTokenUseCase } from "../../core/application/use-cases";
import {
    RefreshTokenRepositoryAdapter,
    UserRepositoryAdapter,
    TokenServiceAdapter
} from "../../infrastructure/adapters";
import { AplicationError } from "../../core/domain/errors";
import { HttpResponse, HttpRequest } from "../ports";

export class RefreshTokenController {
    private readonly refreshTokenUseCase: RefreshTokenUseCase;

    constructor(
        refreshTokenRepositoryAdapter = new RefreshTokenRepositoryAdapter(),
        userRepositoryAdapter = new UserRepositoryAdapter(),
        tokenServiceAdapter = new TokenServiceAdapter()
    ) {
        this.refreshTokenUseCase = new RefreshTokenUseCase(
            refreshTokenRepositoryAdapter,
            userRepositoryAdapter,
            tokenServiceAdapter
        )
    }

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { accessToken } = await this.refreshTokenUseCase.perform({
                refreshToken: httpRequest.body.refreshToken
            });

            return {
                code: 201,
                message: "Token renovado com sucesso",
                body: accessToken
            }
        } catch (error) {
            console.log(error);
            if (error instanceof AplicationError) {
                return {
                    code: error?.status,
                    message: error?.message
                }
            }

            return {
                code: 500,
                message: "Houve um erro inesperado"
            }
        }
    }
}