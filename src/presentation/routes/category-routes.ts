import { FastifyInstance } from "fastify";
import { makeRouteHandler, makeCreateCategoryController } from "../factories";
import { CreateCategoryControllerAdapter } from "../route-adapters";

<<<<<<< HEAD
export async function organizationRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/organizations",
=======
export async function categoryRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/categories",
>>>>>>> e2238ee (feat: added create category flow)
		makeRouteHandler(
			CreateCategoryControllerAdapter,
			makeCreateCategoryController,
		),
	);
}
