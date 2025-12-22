import { UniqueNumericId } from "../value-objects/unique-numeric-id";
import { BusinessRuleViolationError } from "../exception";
import { CategoryProps } from "../props";
import { Name, Color, OrganizationId } from "../value-objects/category";

export class Category {
	private constructor(
		private readonly _name: Name,
		private readonly _color: Color,
		private readonly _organizationId: OrganizationId,
		private readonly _description?: string,
		private readonly _id?: UniqueNumericId,
	) {}

	public static create(props: CategoryProps): Category {
		const { name, color, organizationId, description, id } = props;
		const nameInstance = Name.create(name);
		const colorInstance = Color.create(color);
		const organizationInstance = OrganizationId.create(organizationId);
		const uniqueId = id ? UniqueNumericId.create(id) : UniqueNumericId.create();
		if (description && description.length > 255) {
			throw new BusinessRuleViolationError(
				"Descrição não pode exceder 255 caracteres",
				422,
			);
		}

		return new Category(
			nameInstance,
			colorInstance,
			organizationInstance,
			description,
			uniqueId,
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
