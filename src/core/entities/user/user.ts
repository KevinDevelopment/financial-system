import { UniqueNumericId } from "../../value-objects/global";
import { Email, Name } from "../../value-objects/user";
import { Role } from "./role";

export class User {
    private constructor(
        private readonly name: Name,
        private readonly email: Email,
        private readonly role: Role,
        private readonly hashPassword: string,
        private readonly id?: UniqueNumericId
    ) { }
}