import { FastifyInstance } from "fastify";
import { makeRouteHandler, makeCreateUserController } from "../factories";
import { CreateUserControllerAdapter } from "../route-adapters";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/users",
		makeRouteHandler(
            CreateUserControllerAdapter, 
            makeCreateUserController
        ),
	);
}
