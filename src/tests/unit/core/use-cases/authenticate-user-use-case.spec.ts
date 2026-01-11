import { expect, test, describe, beforeEach, vitest } from "vitest";
import { InMemoryUserAdapter } from "../../../../infrastructure/in-memory";
import { AuthenticateUserUseCase } from "../../../../core/aplication/use-cases/authenticate-user-use-case";
import { AuthenticateUserInputDto } from "../../../../core/aplication/dto";
import {
    InvalidCredentialsError,
    MissingDataError
} from "../../../../core/domain/errors";
import { User } from "../../../../core/domain/entities/user";
import { UserProps } from "../../../../core/domain/props";
import { InMemoryPasswordHasherAdapter, InMemoryTokenServiceAdapter, InMemoryRefreshTokenAdapter } from "../../../../infrastructure/in-memory";

let userRepository: InMemoryUserAdapter;
let passwordHasher: InMemoryPasswordHasherAdapter;
let tokenService: InMemoryTokenServiceAdapter;
let refreshTokenRepository: InMemoryRefreshTokenAdapter;
let useCase: AuthenticateUserUseCase;

const userProps: UserProps = {
    name: "John Doe",
    email: "john.doe@example.com",
    passwordHash: "",
    organizationId: 123456n,
    role: 1,
};

const correctInput: AuthenticateUserInputDto = {
    email: "john.doe@example.com",
    password: "password123",
};

beforeEach(() => {
    userRepository = new InMemoryUserAdapter();
    passwordHasher = new InMemoryPasswordHasherAdapter();
    tokenService = new InMemoryTokenServiceAdapter();
    refreshTokenRepository = new InMemoryRefreshTokenAdapter();
    useCase = new AuthenticateUserUseCase(
        userRepository,
        passwordHasher,
        tokenService,
        refreshTokenRepository
    );
});

describe("authenticate user use case tests", () => {
    test("Should throw MissingDataError if email is missing", async () => {
        const input = { ...correctInput, email: "" };

        await expect(useCase.perform(input)).rejects.toBeInstanceOf(MissingDataError);
    });

    test("Should throw MissingDataError if password is missing", async () => {
        const input = { ...correctInput, password: "" };

        await expect(useCase.perform(input)).rejects.toBeInstanceOf(MissingDataError);
    });

    test("Should throw InvalidCredentialsError if user does not exist", async () => {
        await expect(useCase.perform(correctInput)).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    test("Should throw InvalidCredentialsError if password is incorrect", async () => {
        const user = User.create(userProps);
        await userRepository.create(user);

        const input = { ...correctInput, password: "wrongpassword" };

        await expect(useCase.perform(input)).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    test("Should return access and refresh tokens on successful authentication", async () => {
        const user = User.create(userProps);
        const passwordHash = await passwordHasher.hash("password123");
        const userWithPassword = user.definePassword(passwordHash);
        await userRepository.create(userWithPassword);
        const output = await useCase.perform(correctInput);

        console.log(output);

        expect(output).toHaveProperty("accessToken");
        expect(output).toHaveProperty("refreshToken");
    });

    test("Should return an error if password is incorrect", async () => {
        const user = User.create(userProps);
        const passwordHash = await passwordHasher.hash("password123");
        const userWithPassword = user.definePassword(passwordHash);
        await userRepository.create(userWithPassword);

        const input = { ...correctInput, password: "wrongpassword" };

        await expect(useCase.perform(input)).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});         