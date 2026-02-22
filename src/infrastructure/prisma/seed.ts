import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { UniqueNumericId } from "../../core/domain/value-objects/global";
import { Role } from "../../core/domain/entities/user/role";
import argon2 from "argon2";
import { readFileSync } from "fs";

function getSeedPassword() {
    try {
        return readFileSync("/run/secrets/seed_admin_password", "utf-8").trim();
    } catch {
        return process.env.SEED_ADMIN_PASSWORD ?? "";
    }
}

function getDatabaseUrl() {
    try {
        return readFileSync("/run/secrets/database_url", "utf-8").trim();
    } catch {
        return process.env.DATABASE_URL ?? "";
    }
}

async function main() {
    const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });
    const prisma = new PrismaClient({ adapter });

    const orgName = "Org Exemplo";
    let organization = await prisma.organization.findFirst({
        where: { name: orgName },
    });

    if (!organization) {
        organization = await prisma.organization.create({
            data: {
                id: UniqueNumericId.create().value,
                name: orgName,
                phone: "5511987654321",
                socialReason: "Razão Social Exemplo",
                cnpj: "34579352000165",
            },
        });
        console.log(`✔️  Organization criada (id=${organization.id})`);
    } else {
        console.log(`ℹ️  Organization existe (id=${organization.id})`);
    }

    const agentEmail = "kevinjones@gmail.com.bt";
    const agentPassword = getSeedPassword();

    let agent = await prisma.user.findFirst({
        where: { email: agentEmail },
    });

    if (!agent) {
        const hash = await argon2.hash(agentPassword!, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
        });

        agent = await prisma.user.create({
            data: {
                id: UniqueNumericId.create().value,
                name: "usuario teste",
                email: agentEmail,
                passwordHash: hash,
                role: Role.ADMIN,
                organizationId: organization.id,
            },
        });

        console.log(`✔️  User criado (id=${agent.id}, senha=${agentPassword})`);
    } else {
        console.log(`ℹ️  User existe (id=${agent.id})`);
    }

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
