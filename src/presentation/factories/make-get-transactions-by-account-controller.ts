import { GetTransactionsByAccountController } from "../controllers";
export const makeGetTransactionsByAccountController =
	(): GetTransactionsByAccountController =>
		new GetTransactionsByAccountController();
