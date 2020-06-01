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
import {Blog, BlogCategory} from '../models';
import {BlogCategoryService} from '../services';

export class BlogCategoryBlogController {
  constructor(
    @service(BlogCategoryService)
    protected blogCategoryService: BlogCategoryService,
  ) {}

  @get('/blog-categories/{id}/blogs', {
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
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Blog>,
  ): Promise<Blog[]> {
    return this.blogCategoryService.blogsFindByBlogCategory(id, filter);
  }

  @post('/blog-categories/{id}/blogs', {
    responses: {
      '200': {
        description: 'BlogCategory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Blog)}},
      },
    },
  })
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
    responses: {
      '200': {
        description: 'BlogCategory.Blog PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
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
    responses: {
      '200': {
        description: 'BlogCategory.Blog DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Blog)) where?: Where<Blog>,
  ): Promise<Count> {
    return this.blogCategoryService.blogsDeleteByBlogCategory(id, where);
  }
}
