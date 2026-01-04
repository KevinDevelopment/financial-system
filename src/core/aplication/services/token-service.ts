export interface TokenService {
    generate(
        type: "access" | "refresh",
        payload: object
    ): Promise<string>

    verify<TPayload>(
        type: "access" | "refresh",
        token: string
    ): Promise<TPayload>
}