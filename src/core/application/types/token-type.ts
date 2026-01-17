export const TokenType = Object.freeze({
    ACCESS: "access",
    REFRESH: "refresh"
} as const);

export type TokenType = (typeof TokenType)[keyof typeof TokenType]