import { AbstractControllerAdapter } from "./abstract-controller-adapter";
import { CreateOrganizationController } from "../controllers";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateOrganizationControllerAdapter extends AbstractControllerAdapter<CreateOrganizationController> {
    protected async executeController(httpRequest: HttpRequest): Promise<HttpResponse> {
        return await this.controller.execute(httpRequest);
    }
}