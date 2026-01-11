import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { AuthenticateUserController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class AuthenticateUserControllerAdapter extends AbstractRouteAdapter<AuthenticateUserController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
