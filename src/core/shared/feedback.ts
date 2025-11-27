import type { Nullable, StatusCode } from ".";

export type Feedback<T = unknown> = {
	code: StatusCode;
	message: string;
	body?: Nullable<T>;
};
