export class AplicationError extends Error {
	private readonly _status: number;

	constructor(message: string, _status: number) {
		super(message);
		this.message = message;
		this._status = _status;
	}

	public get status(): number {
		return this._status;
	}
}
