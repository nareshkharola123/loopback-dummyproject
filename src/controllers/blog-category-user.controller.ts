import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {BlogCategory, User} from '../models';
import {BlogCategoryRepository} from '../repositories';
import {OPERATION_SECURITY_SPEC} from './specs/security-spec';

export class BlogCategoryUserController {
  constructor(
    @repository(BlogCategoryRepository)
    public blogCategoryRepository: BlogCategoryRepository,
  ) {}

  @get('/blog-categories/{id}/user', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  async getUser(
    @param.path.number('id') id: typeof BlogCategory.prototype.id,
  ): Promise<User> {
    return this.blogCategoryRepository.user(id);
  }
}
