import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

class Prisma {
	private static _instance: PrismaClient;

	public static get instance(): PrismaClient {
		if (!this._instance) {
			const adapter = new PrismaPg({
				connectionString: process.env.DATABASE_URL,
			});

			this._instance = new PrismaClient({
				adapter,
				log: ["error", "warn", "query"],
				errorFormat: "pretty",
			});
		}

		return this._instance;
	}
}

export const prisma = Prisma.instance;
export type PrismaClientType = PrismaClient;
