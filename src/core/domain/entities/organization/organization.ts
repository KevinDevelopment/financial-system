import { CNPJ, Address, Name } from "../../value-objects/organization";
import { UniqueNumericId } from "../../value-objects/global";
import { OrganizationProps } from "../../props";

export class Organization {
	private constructor(
		private readonly _name: Name,
		private readonly _cnpj: CNPJ,
		private readonly _socialReason?: string,
		private readonly _phone?: string,
		private readonly _address?: Address,
		private readonly _id?: UniqueNumericId,
	) {}

	public static create(props: OrganizationProps): Organization {
		const { name, cnpj, socialReason, phone, address, id } = props;

		return new Organization(
			Name.create(name),
			cnpj ? CNPJ.create(cnpj) : null,
			socialReason,
			phone,
			address ? Address.create(address) : null,
			id ? UniqueNumericId.create(id) : UniqueNumericId.create(),
		);
	}

	public get name(): Name {
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
