import { FastifyRequest, FastifyReply } from "fastify";
import { VerifyTokenUseCase } from "../../core/application/use-cases";
import { TokenServiceAdapter } from "../../infrastructure/adapters";

export class AuthenticateMiddleware {
    static async authenticate(request: FastifyRequest, reply: FastifyReply) {
        try {
            const token = request.headers["x-access-token"] as string;

            const tokenServiceAdapter = new TokenServiceAdapter();
            const verifyToken = new VerifyTokenUseCase(tokenServiceAdapter);
            const { sub, organizationId, role } = await verifyToken.perform({ token });

            request.tenant = {
                sub,
                organizationId,
                role
            }
        } catch (error) {
            reply.code(error?.status).send({
                code: error?.status,
                message: error?.message
            })
        }
    }
}