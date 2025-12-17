import { CreateOrganizationUseCase } from "../../core/use-cases";
import { OrganizationAdapter } from "../../infrastructure/adapters";
import { AplicationError } from "../../core/exception";
import { HttpRequest, HttpResponse } from "../ports";

export class CreateOrganizationController {
    private readonly createOrganizationUseCase: CreateOrganizationUseCase

    constructor(
        organizationAdapter = new OrganizationAdapter()
    ) {
        this.createOrganizationUseCase = new CreateOrganizationUseCase(organizationAdapter);
    }

    async execute(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = await this.createOrganizationUseCase.perform({
                name: httpRequest.body.name,
                socialReason: httpRequest.body.socialReason,
                cnpj: httpRequest.body.cnpj,
                address: httpRequest.body.address,
                phone: httpRequest.body.phone,
            });

            return {
                code: 201,
                message: "Organização criada com sucesso",
                body: id
            }
        } catch (error) {
            if (error instanceof AplicationError) {
                return {
                    code: error?.status,
                    message: error?.message
                }
            }

            return {
                code: 500,
                message: "Houve um erro inesperado"
            }
        }
    }
}