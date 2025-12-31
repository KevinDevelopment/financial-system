import { User } from "../../core/domain/entities/user";
import { UserRepository } from "../../core/aplication/repositories";
import { prisma } from "../config";
import { userMapper } from "../mappers";

export class UserRepositoryAdapter implements UserRepository {
    async create(user: User): Promise<void> {
        const data = userMapper.toPersistence(user);

        await prisma.user.create({
            data: {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                hashPassword: data.passwordHash,
                organization: {
                    connect: {
                        id: data.organizationId
                    }
                }
            }
        })
    }

    async findByEmail(email: string, organizationId: bigint): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                email,
                organizationId
            }
        });

        if (!user) return null;

        return userMapper.toDomain(user);
    }
}