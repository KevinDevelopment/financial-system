import { fastify } from "./app";
import { registerRoutes } from "../routes";

async function bootstrap() {
	fastify.register(registerRoutes);

	await fastify.listen({
		port: Number(process.env.PORT) || 3000,
		host: "0.0.0.0",
	});

	console.log(`🚀 Servidor rodando na porta ${process.env.PORT || 8766}`);
}

process.on("SIGINT", async () => {
	console.log("\n🛑 Encerrando servidor...");
	await fastify.close();
	console.log("✅ Servidor encerrado");
	process.exit(0);
});

process.on("SIGTERM", async () => {
	console.log("\n🛑 Encerrando servidor...");
	await fastify.close();
	console.log("✅ Servidor encerrado");
	process.exit(0);
});

bootstrap();
