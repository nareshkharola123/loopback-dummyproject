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
import {
  User,
  BlogCategory,
} from '../models';
import {UserRepository} from '../repositories';

export class UserBlogCategoryController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/blog-categories', {
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
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<BlogCategory>,
  ): Promise<BlogCategory[]> {
    return this.userRepository.blogCategories(id).find(filter);
  }

  @post('/users/{id}/blog-categories', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(BlogCategory)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {
            title: 'NewBlogCategoryInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) blogCategory: Omit<BlogCategory, 'id'>,
  ): Promise<BlogCategory> {
    return this.userRepository.blogCategories(id).create(blogCategory);
  }

  @patch('/users/{id}/blog-categories', {
    responses: {
      '200': {
        description: 'User.BlogCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
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
    @param.query.object('where', getWhereSchemaFor(BlogCategory)) where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.userRepository.blogCategories(id).patch(blogCategory, where);
  }

  @del('/users/{id}/blog-categories', {
    responses: {
      '200': {
        description: 'User.BlogCategory DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(BlogCategory)) where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.userRepository.blogCategories(id).delete(where);
  }
}
