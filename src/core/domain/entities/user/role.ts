    export const Role = Object.freeze({
        MANAGER: 1,
        ADMIN: 2,
        USER: 3
    } as const);

    export type Role = (typeof Role)[keyof typeof Role];