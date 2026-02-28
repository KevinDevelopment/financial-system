import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { GetCategoriesController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class GetCategoriesControllerAdapter extends AbstractRouteAdapter<GetCategoriesController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
