import { FastifyRequest, FastifyReply } from "fastify";
import { HttpRequest, HttpResponse } from "../ports/index.js";
import { Serializer } from "../../core/application/shared";

export abstract class AbstractRouteAdapter<TController> {
	constructor(protected readonly controller: TController) {}

	public async handle(
		request: FastifyRequest,
		reply: FastifyReply,
	): Promise<void> {
		const httpRequest = this.buildHttpRequest(request);
		const httpResponse = await this.executeController(httpRequest);
		await this.sendResponse(reply, httpResponse);
	}

	protected abstract executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse>;

	protected buildHttpRequest(request: FastifyRequest): HttpRequest {
		return {
			body: request.body,
			headers: request.headers,
			params: request.params,
			query: request.query,
			tenant: request.tenant,
		};
	}

	protected async sendResponse(
		reply: FastifyReply,
		httpResponse: HttpResponse,
	): Promise<void> {
		const response: Record<string, any> = {
			message: httpResponse?.message,
		};

		if (httpResponse?.body !== undefined) {
			response.body = this.formatResponseBody(httpResponse.body);
		}

		reply.code(httpResponse?.code).send(response);
	}

	protected formatResponseBody(body: any): any {
		return Serializer.safeJson(body);
	}
}
