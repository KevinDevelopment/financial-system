import { TokenService } from "../../core/application/services";

export class InMemoryTokenServiceAdapter implements TokenService {
	async generate(): Promise<string> {
		return "fake-token";
	}

	async verify<TPayload>(): Promise<TPayload> {
		return {} as TPayload;
	}
}
