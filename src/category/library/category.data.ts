import { CategoryEntity } from 'src/typeOrm/entities/Category';

export class CategoryData {
  async createResponse(input: CategoryEntity, imagepath: string | undefined) {
    const data = {
      category_id: input.id,
      title: input.title,
      description: input.description,
      // category_type: input.category_type,
      slug: input.slug,
      status: input.status,
      image: imagepath,
    };
    return data;
  }
}
