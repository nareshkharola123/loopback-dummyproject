import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {Count, CountSchema, Filter, Where} from '@loopback/repository';
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
import {Blog} from '../blog/blog.model';
import {BlogCategory} from './blog-category.model';
import {BlogCategoryService} from './blog-category.service';

export class BlogCategoryBlogController {
  constructor(
    @service(BlogCategoryService)
    protected blogCategoryService: BlogCategoryService,
  ) {}

  @get('/blog-categories/{id}/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of BlogCategory has many Blog',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Blog)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Blog>,
  ): Promise<Blog[]> {
    return this.blogCategoryService.blogsFindByBlogCategory(id, filter);
  }

  @post('/blog-categories/{id}/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BlogCategory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Blog)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @param.path.number('id') id: typeof BlogCategory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blog, {
            title: 'NewBlogInBlogCategory',
            exclude: ['id'],
            optional: ['blogCategoryId'],
          }),
        },
      },
    })
    blog: Omit<Blog, 'id'>,
  ): Promise<Blog> {
    return this.blogCategoryService.blogsCreateByBlogCategory(id, blog);
  }

  @patch('/blog-categories/{id}/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BlogCategory.Blog PATCH success count',
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
          schema: getModelSchemaRef(Blog, {partial: true}),
        },
      },
    })
    blog: Partial<Blog>,
    @param.query.object('where', getWhereSchemaFor(Blog)) where?: Where<Blog>,
  ): Promise<Count> {
    return this.blogCategoryService.blogsPatchByBlogCategory(id, blog, where);
  }

  @del('/blog-categories/{id}/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BlogCategory.Blog DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Blog)) where?: Where<Blog>,
  ): Promise<Count> {
    return this.blogCategoryService.blogsDeleteByBlogCategory(id, where);
  }
}
