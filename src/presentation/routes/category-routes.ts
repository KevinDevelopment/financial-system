import { FastifyInstance } from "fastify";
import { makeRouteHandler, makeCreateCategoryController } from "../factories";
import { CreateCategoryControllerAdapter } from "../route-adapters";

export async function categoryRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/categories",
		makeRouteHandler(
			CreateCategoryControllerAdapter,
			makeCreateCategoryController,
		),
	);
}
