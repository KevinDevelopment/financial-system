import fs from "fs";

function getSecret(name: string): string {
    if (process.env[name]) return process.env[name] as string;

    const path = `/run/secrets/${name}`;

    if (!fs.existsSync(path)) {
        throw new Error(`❌ Missing secret: ${name}`);
    }

    return fs.readFileSync(path, "utf8").trim();
}

const REQUIRED_SECRETS = [
    "access_token_secret",
    "database_url",
    "port",
    "postgres_db",
    "postgres_host_port",
    "postgres_internal_port",
    "postgres_password",
    "postgres_user",
    "redis_host_port",
    "redis_internal_port",
    "redis_password",
    "redis_url",
    "refresh_token_secret",
    "token_algorithm"
] as const;

function validateSecrets() {
    console.log("🔐 Validating secrets...");

    for (const secret of REQUIRED_SECRETS) {
        getSecret(secret);
    }

    console.log("✅ All secrets loaded");
}

validateSecrets();

export const config = {
    accessTokenSecret: getSecret("access_token_secret"),
    refreshTokenSecret: getSecret("refresh_token_secret"),
    tokenAlgorithm: getSecret("token_algorithm"),

    databaseUrl: getSecret("database_url"),
    port: Number(getSecret("port")),

    postgres: {
        db: getSecret("postgres_db"),
        user: getSecret("postgres_user"),
        password: getSecret("postgres_password"),
        hostPort: getSecret("postgres_host_port"),
        internalPort: getSecret("postgres_internal_port"),
    },

    redis: {
        url: getSecret("redis_url"),
        password: getSecret("redis_password"),
        hostPort: getSecret("redis_host_port"),
        internalPort: getSecret("redis_internal_port"),
    },
};