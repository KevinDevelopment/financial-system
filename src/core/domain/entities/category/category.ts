import { UniqueNumericId, OrganizationId } from "../../value-objects/global";
import { BusinessRuleViolationError } from "../../errors";
import { CategoryProps } from "../../props";
import { Name, Color } from "../../value-objects/category";

export class Category {
	private constructor(
		private readonly _name: Name,
		private readonly _color: Color,
		private readonly _organizationId: OrganizationId,
		private readonly _description?: string,
		private readonly _id?: UniqueNumericId,
	) { }

	public static create(props: CategoryProps): Category {
		const { name, color, organizationId, description, id } = props;
		const MAX_QUANTITY_OF_PERMITTED_CHARACTERS = 255;

		if (description && description.length > MAX_QUANTITY_OF_PERMITTED_CHARACTERS) {
			throw new BusinessRuleViolationError(
				"Descrição não pode exceder 255 caracteres",
				422,
			);
		}

		return new Category(
			Name.create(name),
			Color.create(color),
			OrganizationId.create(organizationId),
			description,
			id ? UniqueNumericId.create(id) : UniqueNumericId.create()
		);
	}

	public get id(): UniqueNumericId {
		return this._id;
	}

	public get name(): Name {
		return this._name;
	}

	public get color(): Color {
		return this._color;
	}

	public get description(): string {
		return this._description;
	}

	public get organizationId(): OrganizationId {
		return this._organizationId;
	}
}
