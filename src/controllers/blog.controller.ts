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
import {Blog} from '../models';
import {BlogService} from '../services';

export class BlogController {
  constructor(
    @service(BlogService)
    public blogService: BlogService,
  ) {}

  @post('/blogs', {
    responses: {
      '200': {
        description: 'Blog model instance',
        content: {'application/json': {schema: getModelSchemaRef(Blog)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blog, {
            title: 'NewBlog',
            exclude: ['id'],
          }),
        },
      },
    })
    blog: Omit<Blog, 'id'>,
  ): Promise<Blog> {
    return this.blogService.create(blog);
  }

  @get('/blogs/count', {
    responses: {
      '200': {
        description: 'Blog model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Blog) where?: Where<Blog>): Promise<Count> {
    return this.blogService.count(where);
  }

  @get('/blogs', {
    responses: {
      '200': {
        description: 'Array of Blog model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Blog, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Blog) filter?: Filter<Blog>): Promise<Blog[]> {
    return this.blogService.find(filter);
  }

  @patch('/blogs', {
    responses: {
      '200': {
        description: 'Blog PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blog, {partial: true}),
        },
      },
    })
    blog: Blog,
    @param.where(Blog) where?: Where<Blog>,
  ): Promise<Count> {
    return this.blogService.updateAll(blog, where);
  }

  @get('/blogs/{id}', {
    responses: {
      '200': {
        description: 'Blog model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Blog, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Blog, {exclude: 'where'}) filter?: FilterExcludingWhere<Blog>,
  ): Promise<Blog> {
    return this.blogService.findById(id, filter);
  }

  @patch('/blogs/{id}', {
    responses: {
      '204': {
        description: 'Blog PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Blog, {partial: true}),
        },
      },
    })
    blog: Blog,
  ): Promise<void> {
    await this.blogService.updateById(id, blog);
  }

  @put('/blogs/{id}', {
    responses: {
      '204': {
        description: 'Blog PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() blog: Blog,
  ): Promise<void> {
    await this.blogService.replaceById(id, blog);
  }

  @del('/blogs/{id}', {
    responses: {
      '204': {
        description: 'Blog DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogService.deleteById(id);
  }
}
