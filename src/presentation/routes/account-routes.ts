import { FastifyInstance } from "fastify";
import {
	makeRouteHandler,
	makeCreateAccountController,
	makeCreateTransactionController,
	makeGetAccountsController,
	makeGetTransactionsByAccountController,
} from "../factories";
import {
	CreateAccountControllerAdapter,
	CreateTransactionControllerAdapter,
	GetAccountsControllerAdapter,
	GetTransactionsByControllerAdapter,
} from "../route-adapters";
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

	fastify.post(
		"/v1/accounts/:accountId/transactions",
		{ preHandler: AuthenticateMiddleware.authenticate },
		makeRouteHandler(
			CreateTransactionControllerAdapter,
			makeCreateTransactionController,
		),
	);

	fastify.get(
		"/v1/accounts",
		{ preHandler: AuthenticateMiddleware.authenticate },
		makeRouteHandler(GetAccountsControllerAdapter, makeGetAccountsController),
	);

	fastify.get(
		"/v1/accounts/:accountId/transactions",
		{ preHandler: AuthenticateMiddleware.authenticate },
		makeRouteHandler(
			GetTransactionsByControllerAdapter,
			makeGetTransactionsByAccountController,
		),
	);
}
