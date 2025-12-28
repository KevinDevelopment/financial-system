import { UniqueNumericId } from "../value-objects/global";

export class User {
    private constructor(
        private readonly email: string,
        private readonly name: string,
        private readonly id?: UniqueNumericId
    ) { }
}