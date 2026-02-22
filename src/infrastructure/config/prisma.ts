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

	public static async connect(): Promise<void> {
		const maxRetries = 10;
		let retries = 0;

		while (retries < maxRetries) {
			try {
				await Prisma.instance.$connect();
				console.log("✅ Postgres conectado com sucesso");
				return;
			} catch (err) {
				retries++;
				const delay = Math.min(retries * 500, 5000);
				console.log(`🔁 Postgres: tentativa ${retries}, aguardando ${delay}ms...`);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}

		throw new Error("❌ Postgres: muitas tentativas, desistindo...");
	}
}

export const prisma = Prisma.instance;
export const connectDatabase = () => Prisma.connect();
export type PrismaClientType = PrismaClient;