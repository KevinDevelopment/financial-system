import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { cors } from "../../infrastructure/config";

export const fastify = Fastify({
	logger: true,
	trustProxy: true,
});

fastify.register(fastifyCors, cors);

fastify.get("/health", async () => {
	return { status: "ok", timestamp: new Date().toISOString() };
});
