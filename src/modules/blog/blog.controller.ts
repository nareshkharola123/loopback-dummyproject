import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
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
import {RoleKey} from '../../enums/role.enum';
import {basicAuthorization} from '../auth/basic.authorization';
import {OPERATION_SECURITY_SPEC} from '../auth/specs/security-spec';
import {Blog} from './blog.model';
import {BlogService} from './blog.service';

export class BlogController {
  constructor(
    @service(BlogService)
    public blogService: BlogService,
  ) {}

  @post('/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Blog model instance',
        content: {'application/json': {schema: getModelSchemaRef(Blog)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
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
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Blog model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async count(@param.where(Blog) where?: Where<Blog>): Promise<Count> {
    return this.blogService.count(where);
  }

  @get('/blogs', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async find(@param.filter(Blog) filter?: Filter<Blog>): Promise<Blog[]> {
    return this.blogService.find(filter);
  }

  @patch('/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Blog PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
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
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Blog, {exclude: 'where'}) filter?: FilterExcludingWhere<Blog>,
  ): Promise<Blog> {
    return this.blogService.findById(id, filter);
  }

  @patch('/blogs/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Blog PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
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
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Blog PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() blog: Blog,
  ): Promise<void> {
    await this.blogService.replaceById(id, blog);
  }

  @del('/blogs/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Blog DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogService.deleteById(id);
  }
}
