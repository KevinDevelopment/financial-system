import { FastifyInstance } from "fastify";
import {
	makeRouteHandler,
	makeCreateCategoryController,
	makeGetCategoriesController,
} from "../factories";
import {
	CreateCategoryControllerAdapter,
	GetCategoriesControllerAdapter,
} from "../route-adapters";
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

	fastify.get(
		"/v1/categories",
		{ preHandler: AuthenticateMiddleware.authenticate },
		makeRouteHandler(
			GetCategoriesControllerAdapter,
			makeGetCategoriesController,
		),
	);
}
