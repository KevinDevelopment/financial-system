import { AbstractRouteAdapter } from "./abstract-router-adapter";
import { GetTransactionsByAccountController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class GetTransactionsByControllerAdapter extends AbstractRouteAdapter<GetTransactionsByAccountController> {
    protected async executeController(
        httpRequest: HttpRequest,
    ): Promise<HttpResponse> {
        return await this.controller.execute(httpRequest);
    }
}