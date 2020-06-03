import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
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
import {OPERATION_SECURITY_SPEC} from '../auth/specs/security-spec';
import {BlogCategory} from './blog-category.model';
import {BlogCategoryService} from './blog-category.service';

export class BlogCategoryController {
  constructor(
    @service(BlogCategoryService)
    public blogCategoryService: BlogCategoryService,
  ) {}

  @post('/blog-categories', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BlogCategory model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(BlogCategory)},
        },
      },
    },
  })
  @authenticate('jwt')
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
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BlogCategory model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async count(
    @param.where(BlogCategory) where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.blogCategoryService.count(where);
  }

  @get('/blog-categories', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  async find(
    @param.filter(BlogCategory) filter?: Filter<BlogCategory>,
  ): Promise<BlogCategory[]> {
    return this.blogCategoryService.find(filter);
  }

  @patch('/blog-categories', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BlogCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
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
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(BlogCategory, {exclude: 'where'})
    filter?: FilterExcludingWhere<BlogCategory>,
  ): Promise<BlogCategory> {
    return this.blogCategoryService.findById(id, filter);
  }

  @patch('/blog-categories/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'BlogCategory PATCH success',
      },
    },
  })
  @authenticate('jwt')
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
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'BlogCategory PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() blogCategory: BlogCategory,
  ): Promise<void> {
    await this.blogCategoryService.replaceById(id, blogCategory);
  }

  @del('/blog-categories/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'BlogCategory DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogCategoryService.deleteById(id);
  }
}
