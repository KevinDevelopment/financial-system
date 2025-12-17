import { PrismaClient } from "@prisma/client";

class Prisma {
    private static _instance: PrismaClient;

    public static get instance(): PrismaClient {
        if (!this._instance) {
            this._instance = new PrismaClient({
                log: ["error", "warn", "query"],
                errorFormat: "pretty",
            });
        }

        return this._instance;
    }
}

export const prisma = Prisma.instance;
export type PrismaClientType = PrismaClient;
