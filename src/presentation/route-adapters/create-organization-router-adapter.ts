import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { CreateOrganizationController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateOrganizationControllerAdapter extends AbstractRouteAdapter<CreateOrganizationController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
