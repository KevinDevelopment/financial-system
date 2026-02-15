import { FastifyInstance } from "fastify";
import {
	makeRouteHandler,
	makeAuthenticateUserController,
	makeCreateUserController,
	makeRefreshTokenController,
	makeLogoutController,
	makeGetUsersController,
} from "../factories";
import {
	CreateUserControllerAdapter,
	AuthenticateUserControllerAdapter,
	RefreshTokenControllerAdapter,
	LogoutControllerAdapter,
	GetUsersControllerAdapter,
} from "../route-adapters";
import { AuthenticateMiddleware } from "../middleware";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/users",
		{ preHandler: AuthenticateMiddleware.authenticate },
		makeRouteHandler(CreateUserControllerAdapter, makeCreateUserController),
	);

	fastify.post(
		"/v1/auth/login",
		makeRouteHandler(
			AuthenticateUserControllerAdapter,
			makeAuthenticateUserController,
		),
	);

	fastify.post(
		"/v1/auth/refresh",
		makeRouteHandler(RefreshTokenControllerAdapter, makeRefreshTokenController),
	);

	fastify.post(
		"/v1/auth/logout",
		makeRouteHandler(LogoutControllerAdapter, makeLogoutController),
	);

	fastify.get(
		"/v1/users",
		{ preHandler: AuthenticateMiddleware.authenticate },
		makeRouteHandler(GetUsersControllerAdapter, makeGetUsersController),
	);
}
