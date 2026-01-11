import { TokenService } from "../../core/aplication/services";

export class InMemoryTokenService implements TokenService {
    async generate(): Promise<string> {
        return "fake-token";
    }

    async verify<TPayload>(): Promise<TPayload> {
        return {} as TPayload;
    }
}
