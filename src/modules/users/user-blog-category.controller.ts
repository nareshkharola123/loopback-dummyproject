import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {OPERATION_SECURITY_SPEC} from '../auth/specs/security-spec';
import {BlogCategory} from '../blog-category/blog-category.model';
import {User} from './user.model';
import {UserRepository} from './user.repository';

export class UserBlogCategoryController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/blog-categories', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User has many BlogCategory',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(BlogCategory)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<BlogCategory>,
  ): Promise<BlogCategory[]> {
    return this.userRepository.blogCategories(id).find(filter);
  }

  @post('/users/{id}/blog-categories', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(BlogCategory)},
        },
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {
            title: 'NewBlogCategoryInUser',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    blogCategory: Omit<BlogCategory, 'id'>,
  ): Promise<BlogCategory> {
    return this.userRepository.blogCategories(id).create(blogCategory);
  }

  @patch('/users/{id}/blog-categories', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.BlogCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {partial: true}),
        },
      },
    })
    blogCategory: Partial<BlogCategory>,
    @param.query.object('where', getWhereSchemaFor(BlogCategory))
    where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.userRepository.blogCategories(id).patch(blogCategory, where);
  }

  @del('/users/{id}/blog-categories', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User.BlogCategory DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(BlogCategory))
    where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.userRepository.blogCategories(id).delete(where);
  }
}
