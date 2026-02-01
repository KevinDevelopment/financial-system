import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { RefreshTokenController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class RefreshTokenControllerAdapter extends AbstractRouteAdapter<RefreshTokenController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
