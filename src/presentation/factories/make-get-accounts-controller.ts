import { GetAccountsController } from "../controllers";
export const makeGetAccountsController = (): GetAccountsController =>
	new GetAccountsController();
