import type { Feedback, Optional } from ".";

export interface UseCase {
	perform(...data: any): Promise<Optional<Feedback>>;
}
