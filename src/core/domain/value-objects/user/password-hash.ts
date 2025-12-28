import { BusinessRuleViolationError } from "../../errors";

export class PasswordHash {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
    Object.freeze(this);
  }

  public static create(value: string): PasswordHash {
    if (!value || value.trim().length === 0) {
      throw new BusinessRuleViolationError(
        "Password hash não pode ser vazio",
        422
      );
    }

    return new PasswordHash(value);
  }

  public get value(): string {
    return this._value;
  }
}
