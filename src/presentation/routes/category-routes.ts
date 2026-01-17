import { FastifyInstance } from "fastify";
import { makeRouteHandler, makeCreateCategoryController } from "../factories";
import { CreateCategoryControllerAdapter } from "../route-adapters";
import { AuthenticateMiddleware } from "../middleware";

export async function categoryRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/categories",
		{ preHandler: AuthenticateMiddleware.authenticate },
		makeRouteHandler(
			CreateCategoryControllerAdapter,
			makeCreateCategoryController,
		),
	);
}
