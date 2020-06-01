import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {BlogCategory} from '../models';
import {BlogCategoryRepository} from '../repositories';
import {BlogCategoryService} from '../services';

export class BlogCategoryController {
  constructor(
    @repository(BlogCategoryRepository)
    public blogCategoryRepository: BlogCategoryRepository,
    @service(BlogCategoryService)
    public blogCategoryService: BlogCategoryService,
  ) {}

  @post('/blog-categories', {
    responses: {
      '200': {
        description: 'BlogCategory model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(BlogCategory)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {
            title: 'NewBlogCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    blogCategory: Omit<BlogCategory, 'id'>,
  ): Promise<BlogCategory> {
    return this.blogCategoryService.create(blogCategory);
  }

  @get('/blog-categories/count', {
    responses: {
      '200': {
        description: 'BlogCategory model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(BlogCategory) where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.blogCategoryService.count(where);
  }

  @get('/blog-categories', {
    responses: {
      '200': {
        description: 'Array of BlogCategory model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(BlogCategory, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(BlogCategory) filter?: Filter<BlogCategory>,
  ): Promise<BlogCategory[]> {
    return this.blogCategoryService.find(filter);
  }

  @patch('/blog-categories', {
    responses: {
      '200': {
        description: 'BlogCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {partial: true}),
        },
      },
    })
    blogCategory: BlogCategory,
    @param.where(BlogCategory) where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.blogCategoryService.updateAll(blogCategory, where);
  }

  @get('/blog-categories/{id}', {
    responses: {
      '200': {
        description: 'BlogCategory model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(BlogCategory, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(BlogCategory, {exclude: 'where'})
    filter?: FilterExcludingWhere<BlogCategory>,
  ): Promise<BlogCategory> {
    return this.blogCategoryService.findById(id, filter);
  }

  @patch('/blog-categories/{id}', {
    responses: {
      '204': {
        description: 'BlogCategory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {partial: true}),
        },
      },
    })
    blogCategory: BlogCategory,
  ): Promise<void> {
    await this.blogCategoryService.updateById(id, blogCategory);
  }

  @put('/blog-categories/{id}', {
    responses: {
      '204': {
        description: 'BlogCategory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() blogCategory: BlogCategory,
  ): Promise<void> {
    await this.blogCategoryService.replaceById(id, blogCategory);
  }

  @del('/blog-categories/{id}', {
    responses: {
      '204': {
        description: 'BlogCategory DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogCategoryService.deleteById(id);
  }
}
