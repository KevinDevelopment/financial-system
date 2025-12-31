import { User } from "../../core/domain/entities/user";

export const userMapper = {
	toPersistence(user: User) {
		return {
			id: user.id.value,
			name: user.name.value,
			email: user.email.value,
			role: user.role.type,
			passwordHash: user.passwordHash.value,
			organizationId: user.organizationId.value,
		};
	},

	toDomain(row: any): User {
		return User.create({
			id: row.id,
			name: row.name,
			email: row.email,
			role: row.role,
			passwordHash: row.passwordHash,
			organizationId: row.organizationId,
		});
	},
};
