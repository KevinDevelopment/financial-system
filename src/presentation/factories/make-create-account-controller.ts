import { CreateAccountController } from "../controllers";
export const makeCreateAccountController = (): CreateAccountController =>
	new CreateAccountController();
