import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {RoleKey} from '../../enums/role.enum';
import {basicAuthorization} from '../auth/basic.authorization';
import {OPERATION_SECURITY_SPEC} from '../auth/specs/security-spec';
import {User} from '../users/user.model';
import {BlogCategory} from './blog-category.model';
import {BlogCategoryRepository} from './blog-category.repository';

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
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async getUser(
    @param.path.number('id') id: typeof BlogCategory.prototype.id,
  ): Promise<User> {
    return this.blogCategoryRepository.user(id);
  }
}
