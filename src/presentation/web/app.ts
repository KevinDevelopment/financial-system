import Fastify from "fastify";
import fastifyCors from "@fastify/cors";

export const fastify = Fastify({
	logger: true,
	trustProxy: true,
});

fastify.register(fastifyCors, {
	origin: true,
	credentials: true,
});

fastify.get("/health", async () => {
	return { status: "ok", timestamp: new Date().toISOString() };
});
