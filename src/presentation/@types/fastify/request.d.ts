import "fastify";
import { VerifyTokenOutputDto } from "../../../core/application/dto";

declare module "fastify" {
	interface FastifyRequest {
		tenant?: VerifyTokenOutputDto;
	}
}
