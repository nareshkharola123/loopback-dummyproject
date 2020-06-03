import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Blog, BlogCategory} from '../models';
import {BlogService} from '../services';
import {OPERATION_SECURITY_SPEC} from './specs/security-spec';

export class BlogBlogCategoryController {
  constructor(
    @service(BlogService)
    public blogService: BlogService,
  ) {}

  @get('/blogs/{id}/blog-category', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BlogCategory belonging to Blog',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(BlogCategory)},
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async getBlogCategory(
    @param.path.number('id') id: typeof Blog.prototype.id,
  ): Promise<BlogCategory> {
    return this.blogService.getBlogCategoryByBlog(id);
  }
}
