import { expect, test, describe, beforeEach, vi } from "vitest";
import { UserProps, RefreshTokenProps } from "../../../../core/domain/props";
import { RefreshTokenInputDto } from "../../../../core/application/dto";
import { InMemoryRefreshTokenAdapter, InMemoryUserAdapter, InMemoryTokenServiceAdapter } from "../../../../infrastructure/in-memory";
import { RefreshTokenUseCase } from "../../../../core/application/use-cases/refresh-token-use-case";
import { RefreshToken } from "../../../../core/domain/entities/refresh-token";
import { InvalidCredentialsError, MissingDataError } from "../../../../core/domain/errors";
import { User } from "../../../../core/domain/entities/user";

let refreshTokenRepository: InMemoryRefreshTokenAdapter;
let userRepository: InMemoryUserAdapter;
let tokenService: InMemoryTokenServiceAdapter;
let useCase: RefreshTokenUseCase;

const userProps: UserProps = {
    name: "Kevin Jones",
    email: "kevinjones@outlook.com",
    passwordHash: "G$5IFG0t4905ggjiwo499",
    organizationId: 65665656n,
    role: 2,
};

beforeEach(async () => {
    refreshTokenRepository = new InMemoryRefreshTokenAdapter();
    userRepository = new InMemoryUserAdapter();
    tokenService = new InMemoryTokenServiceAdapter();
    useCase = new RefreshTokenUseCase(refreshTokenRepository, userRepository, tokenService);
});

describe("refresh token use case tests", () => {

    test("should generate new access token with valid refresh token", async () => {       
        const user = User.create(userProps);
        await userRepository.create(user);

        const refreshTokenProps: RefreshTokenProps = {
            userId: user.id.value,
            organizationId: user.organizationId.value,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        };
        const refreshToken = RefreshToken.create(refreshTokenProps);
        await refreshTokenRepository.create(refreshToken);
       
        vi.spyOn(tokenService, 'verify').mockResolvedValue({ tokenId: refreshToken.id!.value } as any);

        const input: RefreshTokenInputDto = {
            refreshToken: "fake-token"
        };

      
        const result = await useCase.perform(input);
        
        expect(result).toBeDefined();
        expect(result.accessToken).toBeDefined();
        expect(result.accessToken).toBe("fake-token");
    });

    test("should throw error when refresh token is not provided", async () => {
       
        const input: RefreshTokenInputDto = {
            refreshToken: ""
        };

       
        await expect(useCase.perform(input)).rejects.toThrow(MissingDataError);
        await expect(useCase.perform(input)).rejects.toThrow("Refresh token é obrigatório para renovar sessão");
    });

    test("should throw error when token does not exist in database", async () => {
      
        vi.spyOn(tokenService, 'verify').mockResolvedValue({ tokenId: 999999n } as any);

        const input: RefreshTokenInputDto = {
            refreshToken: "fake-token"
        };

       
        await expect(useCase.perform(input)).rejects.toThrow(InvalidCredentialsError);
        await expect(useCase.perform(input)).rejects.toThrow("Refresh token inválido ou expirado");
    });

    test("should throw error when refresh token is expired", async () => {
       
        const user = User.create(userProps);
        await userRepository.create(user);

        const refreshTokenProps: RefreshTokenProps = {
            userId: user.id.value,
            organizationId: user.organizationId.value,
            expiresAt: new Date(Date.now() - 1000), 
        };
        const refreshToken = RefreshToken.create(refreshTokenProps);
        await refreshTokenRepository.create(refreshToken);

        vi.spyOn(tokenService, 'verify').mockResolvedValue({ tokenId: refreshToken.id!.value } as any);

        const input: RefreshTokenInputDto = {
            refreshToken: "fake-token"
        };

       
        await expect(useCase.perform(input)).rejects.toThrow(InvalidCredentialsError);
        await expect(useCase.perform(input)).rejects.toThrow("Refresh token expirado ou revogado");
    });

    test("should throw error when refresh token has been revoked", async () => {
       
        const user = User.create(userProps);
        await userRepository.create(user);

        const refreshTokenProps: RefreshTokenProps = {
            userId: user.id.value,
            organizationId: user.organizationId.value,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revokedAt: new Date(), 
        };
        const refreshToken = RefreshToken.create(refreshTokenProps);
        await refreshTokenRepository.create(refreshToken);

        vi.spyOn(tokenService, 'verify').mockResolvedValue({ tokenId: refreshToken.id!.value } as any);

        const input: RefreshTokenInputDto = {
            refreshToken: "fake-token"
        };

       
        await expect(useCase.perform(input)).rejects.toThrow(InvalidCredentialsError);
        await expect(useCase.perform(input)).rejects.toThrow("Refresh token expirado ou revogado");
    });

    test("should throw error when user does not exist", async () => {
        
        const refreshTokenProps: RefreshTokenProps = {
            userId: 999999n, 
            organizationId: 65665656n,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        const refreshToken = RefreshToken.create(refreshTokenProps);
        await refreshTokenRepository.create(refreshToken);

        vi.spyOn(tokenService, 'verify').mockResolvedValue({ tokenId: refreshToken.id!.value } as any);

        const input: RefreshTokenInputDto = {
            refreshToken: "fake-token"
        };

        
        await expect(useCase.perform(input)).rejects.toThrow(InvalidCredentialsError);
        await expect(useCase.perform(input)).rejects.toThrow("Usuário não encontrado");
    });

    test("should generate access token with correct user data", async () => {
     
        const user = User.create(userProps);
        await userRepository.create(user);

        const refreshTokenProps: RefreshTokenProps = {
            userId: user.id.value,
            organizationId: user.organizationId.value,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        const refreshToken = RefreshToken.create(refreshTokenProps);
        await refreshTokenRepository.create(refreshToken);

        vi.spyOn(tokenService, 'verify').mockResolvedValue({ tokenId: refreshToken.id!.value } as any);

        const input: RefreshTokenInputDto = {
            refreshToken: "fake-token"
        };

      
        const result = await useCase.perform(input);

        
        expect(result.accessToken).toBe("fake-token");
        expect(result).toBeDefined();
    });

    test("should create refresh token with default expiration when not provided", async () => {
        
        const user = User.create(userProps);
        await userRepository.create(user);

        const refreshTokenProps: RefreshTokenProps = {
            userId: user.id.value,
            organizationId: user.organizationId.value,
           
        };
        const refreshToken = RefreshToken.create(refreshTokenProps);

       
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        expect(refreshToken.expiresAt).toBeDefined();
        expect(refreshToken.expiresAt.getTime()).toBeGreaterThan(Date.now());
       
        expect(Math.abs(refreshToken.expiresAt.getTime() - thirtyDaysFromNow.getTime())).toBeLessThan(60000);
    });
});