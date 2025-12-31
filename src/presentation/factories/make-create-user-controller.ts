import { CreateUserController } from "../controllers";
export const makeCreateUserController = (): CreateUserController =>
	new CreateUserController();
