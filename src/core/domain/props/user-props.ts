export interface UserProps {
	id?: bigint;
	name: string;
	email: string;
	role: number;
	organizationId: unknown;
	passwordHash?: string;
}
