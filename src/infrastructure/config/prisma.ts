import { PrismaClient } from "../generated/prisma/client";
import { config } from "./get-secrets";
import { PrismaPg } from "@prisma/adapter-pg";

class Prisma {
	private static _instance: PrismaClient;

	public static get instance(): PrismaClient {
		if (!this._instance) {
			const adapter = new PrismaPg({
				connectionString: config.databaseUrl,
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
