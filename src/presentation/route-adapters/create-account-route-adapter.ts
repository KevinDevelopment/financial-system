import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { CreateAccountController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateAccountControllerAdapter extends AbstractRouteAdapter<CreateAccountController> {
    protected async executeController(httpRequest: HttpRequest): Promise<HttpResponse> {
        return await this.controller.execute(httpRequest)
    }
}