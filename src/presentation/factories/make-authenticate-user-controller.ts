import { AuthenticateUserController } from "../controllers";
export const makeAuthenticateUserController = (): AuthenticateUserController =>
	new AuthenticateUserController();
