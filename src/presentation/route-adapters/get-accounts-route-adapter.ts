import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { GetAccountsController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class GetAccountsControllerAdapter extends AbstractRouteAdapter<GetAccountsController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
