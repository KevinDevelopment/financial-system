import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { CreateUserController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateUserControllerAdapter extends AbstractRouteAdapter<CreateUserController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
