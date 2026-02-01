import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { LogoutController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class LogoutControllerAdapter extends AbstractRouteAdapter<LogoutController> {
    protected async executeController(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse> {
        return await this.controller.execute(httpRequest);
    }
}