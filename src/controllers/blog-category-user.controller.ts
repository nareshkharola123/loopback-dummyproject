import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  BlogCategory,
  User,
} from '../models';
import {BlogCategoryRepository} from '../repositories';

export class BlogCategoryUserController {
  constructor(
    @repository(BlogCategoryRepository)
    public blogCategoryRepository: BlogCategoryRepository,
  ) { }

  @get('/blog-categories/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to BlogCategory',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof BlogCategory.prototype.id,
  ): Promise<User> {
    return this.blogCategoryRepository.user(id);
  }
}
