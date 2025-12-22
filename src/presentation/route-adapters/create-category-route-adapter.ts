import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { CreateCategoryController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateCategoryControllerAdapter extends AbstractRouteAdapter<CreateCategoryController> {
	protected async executeController(
		httpRequest: HttpRequest,
	): Promise<HttpResponse> {
		return await this.controller.execute(httpRequest);
	}
}
