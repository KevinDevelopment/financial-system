export interface CreateUserInputDto {
    name: string;
    email: string;
    role: number;
    hash: string;
    organizationId: bigint;
}

export interface CreateUserOutputDto {
    id: bigint;
    name: string;
    email: string
}