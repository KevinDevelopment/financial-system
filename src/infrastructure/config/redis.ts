import { config } from "./get-secrets";
import { createClient, RedisClientType } from "redis";

class Redis {
	private static client: RedisClientType;

	public static instance(): RedisClientType {
		if (!Redis.client) {
			Redis.client = createClient({
				url: config.redis.url,
			});

			Redis.client.on("error", (err) => console.error("Redis Error:", err));
			Redis.client.on("connect", () =>
				console.log("🔗 Conectando ao Redis..."),
			);
			Redis.client.on("ready", () =>
				console.log("✅ Redis conectado com sucesso"),
			);
			Redis.client.on("end", () => console.log("❌ Conexão com Redis fechada"));

			Redis.client.connect().catch((err) => {
				console.error("Falha ao conectar no Redis:", err);
			});
		}

		return Redis.client;
	}
}
export const RedisConnection = Redis.instance();
