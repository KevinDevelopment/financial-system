import { FastifyInstance } from "fastify";
import {
	makeRouteHandler,
	makeCreateOrganizationController,
} from "../factories";
import { CreateOrganizationControllerAdapter } from "../route-adapters";

export async function organizationRoutes(fastify: FastifyInstance) {
	fastify.post(
		"/v1/organizations",
		makeRouteHandler(
			CreateOrganizationControllerAdapter,
			makeCreateOrganizationController,
		),
	);
}
