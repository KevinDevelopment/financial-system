import { FastifyInstance } from "fastify";
import { makeRouteHandler, makeCreateCategoryController } from "../factories";
import { CreateCategoryControllerAdapter } from "../route-adapters";

export async function organizationRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/organizations",
		makeRouteHandler(
			CreateCategoryControllerAdapter,
			makeCreateCategoryController,
		),
	);
}
