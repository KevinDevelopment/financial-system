import { GetUsersController } from "../controllers";
export const makeGetUsersController = (): GetUsersController =>
	new GetUsersController();
