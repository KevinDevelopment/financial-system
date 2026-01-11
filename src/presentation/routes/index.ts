import { FastifyInstance } from "fastify";
import { organizationRoutes } from "./organization-routes";
import { categoryRoutes } from "./category-routes";
import { userRoutes } from "./user-routes";

export async function registerRoutes(fastify: FastifyInstance) {
	fastify.register(organizationRoutes);
	fastify.register(categoryRoutes);
	fastify.register(userRoutes);
}
