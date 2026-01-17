export interface AccountProps {
    type: number;
    name: string;
    initialBalance: number;
    currentBalance: number;
    organizationId: unknown;
    userId: unknown;
    id?: bigint;
}
