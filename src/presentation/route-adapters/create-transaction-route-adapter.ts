import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { CreateTransactionController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateTransactionControllerAdapter extends AbstractRouteAdapter<CreateTransactionController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
