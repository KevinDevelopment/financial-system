import { config } from "./get-secrets";
import { createClient, RedisClientType } from "redis";

class Redis {
	private static client: RedisClientType;
	private static connected = false;

	public static instance(): RedisClientType {
		if (!Redis.client) {
			Redis.client = createClient({
				url: config.redis.url,
				socket: {
					reconnectStrategy: (retries) => {
						if (retries > 10) {
							console.error("❌ Redis: muitas tentativas, desistindo...");
							return new Error("Redis unreachable");
						}
						const delay = Math.min(retries * 500, 5000);
						console.log(`🔁 Redis: tentativa ${retries}, aguardando ${delay}ms...`);
						return delay;
					},
				},
			});

			Redis.client.on("error", (err) => console.error("Redis Error:", err));
			Redis.client.on("connect", () => console.log("🔗 Conectando ao Redis..."));
			Redis.client.on("ready", () => {
				console.log("✅ Redis conectado com sucesso");
				Redis.connected = true;
			});
			Redis.client.on("end", () => {
				console.log("❌ Conexão com Redis fechada");
				Redis.connected = false;
			});
		}

		return Redis.client;
	}

	public static async connect(): Promise<void> {
		const client = Redis.instance();
		if (!Redis.connected) {
			await client.connect();
		}
	}
}

export const RedisConnection = Redis.instance();
export const connectRedis = () => Redis.connect();