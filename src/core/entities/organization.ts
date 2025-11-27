import { CNPJ, Address, UniqueNumericId } from "../value-objects";
import { OrganizationProps } from "../props";
import { BusinessRuleViolationError } from "../exception";

export class Organization {
	private constructor(
		private readonly _name: string,
		private readonly _cnpj: CNPJ,
		private readonly _socialReason?: string,
		private readonly _phone?: string,
		private readonly _address?: Address,
		private readonly _id?: UniqueNumericId,
	) {}

	static create(props: OrganizationProps): Organization {
		const { name, cnpj, socialReason, phone, address, id } = props;

		if (!name)
			throw new BusinessRuleViolationError(
				"Nome da empresa é obrigatório",
				422,
			);
		let addressInstance: Address | null;

		if (address) {
			addressInstance = Address.create(address);
		}

		let cnpjInstance: CNPJ | null;
		if (cnpj) {
			cnpjInstance = CNPJ.create(cnpj);
		}

		const uniqueId = id ? UniqueNumericId.create(id) : UniqueNumericId.create();

		return new Organization(
			name,
			cnpjInstance,
			socialReason,
			phone,
			addressInstance,
			uniqueId,
		);
	}

	public get name(): string {
		return this._name;
	}

	public get cnpj(): CNPJ {
		return this._cnpj;
	}

	public get socialReason(): string {
		return this._socialReason;
	}

	public get phone(): string {
		return this._phone;
	}

	public get address(): Address {
		return this._address;
	}

	public get id(): UniqueNumericId {
		return this._id;
	}
}
