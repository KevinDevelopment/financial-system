import { AbstractControllerAdapter } from "../route-adapters";
import { FastifyRequest, FastifyReply } from "fastify";

export const makeRouteHandler = <TController>(
    AdapterClass: new (controller: TController) => AbstractControllerAdapter<TController>,
    controllerFactory: () => TController
) => {
    const controller = controllerFactory();
    const adapter = new AdapterClass(controller);

    return (request: FastifyRequest, reply: FastifyReply) => adapter.handle(request, reply);
};