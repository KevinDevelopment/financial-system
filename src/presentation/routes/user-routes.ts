import { FastifyInstance } from "fastify";
import {
	makeRouteHandler,
	makeAuthenticateUserController,
	makeCreateUserController,
} from "../factories";
import {
	CreateUserControllerAdapter,
	AuthenticateUserControllerAdapter,
} from "../route-adapters";
import { AuthenticateMiddleware } from "../middleware";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/users",
		{ preHandler: AuthenticateMiddleware.authenticate },
		makeRouteHandler(CreateUserControllerAdapter, makeCreateUserController),
	);

	fastify.post(
		"/v1/login",
		makeRouteHandler(
			AuthenticateUserControllerAdapter,
			makeAuthenticateUserController,
		),
	);
}
