import "dotenv/config";
import { defineConfig } from "prisma/config";
import { readFileSync } from "fs";

function getDatabaseUrl() {
	try {
		return readFileSync("/run/secrets/database_url", "utf-8").trim();
	} catch {
		return process.env.DATABASE_URL ?? "";
	}
}

export default defineConfig({
	schema: "./src/infrastructure/prisma/schema.prisma",
	migrations: {
		path: "src/infrastructure/prisma",
	},
	datasource: {
		url: getDatabaseUrl(),
	},
});