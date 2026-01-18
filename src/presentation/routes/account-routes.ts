import { FastifyInstance } from "fastify";
import { makeRouteHandler, makeCreateAccountController } from "../factories";
import { CreateAccountControllerAdapter } from "../route-adapters";
import { AuthenticateMiddleware } from "../middleware";

export async function accountRoutes(fastify: FastifyInstance) {
    fastify.post(
        "/v1/accounts",
        { preHandler: AuthenticateMiddleware.authenticate },
        makeRouteHandler(
            CreateAccountControllerAdapter,
            makeCreateAccountController,
        ),
    );
}
