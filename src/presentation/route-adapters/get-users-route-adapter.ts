import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { GetUsersController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class GetUsersControllerAdapter extends AbstractRouteAdapter<GetUsersController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
