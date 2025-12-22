import { CategoryRepository } from "../repositories";
import { CreateCategoryInputDto, CreateCategoryOutputDto } from "../dto";
import { DataAlreadyExistsError } from "../exception";
import { Category } from "../entities";

export class CreateCategoryUseCase {
    constructor(private readonly categoryRepository: CategoryRepository) { }

    async perform(input: CreateCategoryInputDto): Promise<CreateCategoryOutputDto> {
        const category = Category.create(input);

        const nameAlreadyExists = await this.categoryRepository.findByName(
            category.name.value,
            category.organizationId.value
        );

        if (nameAlreadyExists) {
            throw new DataAlreadyExistsError(
                "Ja existe uma categoria com este nome",
                409,
            );
        }

        await this.categoryRepository.create(category);

        return {
            id: category.id.value,
            name: category.name.value,
            color: category.color.value,
            description: category.description,
        }
    }
}