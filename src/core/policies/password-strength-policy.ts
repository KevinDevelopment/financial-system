import { BusinessRuleViolationError } from "../exception";

export class PasswordStrengthPolicy {
    static validate(password: string): void {
        if (typeof password !== "string") {
            throw new BusinessRuleViolationError(
                "Senha inválida",
                422
            );
        }

        const trimmed = password.trim();

        if (!trimmed) {
            throw new BusinessRuleViolationError(
                "Senha não pode ser vazia",
                422
            );
        }

        if (trimmed.includes(" ")) {
            throw new BusinessRuleViolationError(
                "Senha não pode conter espaços",
                422
            );
        }

        if (trimmed.length < 12) {
            throw new BusinessRuleViolationError(
                "Senha deve conter no mínimo 12 caracteres",
                422
            );
        }

        if (!/[A-Z]/.test(trimmed)) {
            throw new BusinessRuleViolationError(
                "Senha deve conter ao menos uma letra maiúscula",
                422
            );
        }

        if (!/[a-z]/.test(trimmed)) {
            throw new BusinessRuleViolationError(
                "Senha deve conter ao menos uma letra minúscula",
                422
            );
        }

        if (!/\d/.test(trimmed)) {
            throw new BusinessRuleViolationError(
                "Senha deve conter ao menos um número",
                422
            );
        }

        if (!/[\W_]/.test(trimmed)) {
            throw new BusinessRuleViolationError(
                "Senha deve conter ao menos um caractere especial",
                422
            );
        }
    }
}
