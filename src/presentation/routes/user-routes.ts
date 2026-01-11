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

export async function userRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/users",
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
