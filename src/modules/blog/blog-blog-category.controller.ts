import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {OPERATION_SECURITY_SPEC} from '../auth/specs/security-spec';
import {BlogCategory} from '../blog-category/blog-category.model';
import {BlogCategoryRepository} from '../blog-category/blog-category.repository';
import {Blog} from './blog.model';
import {BlogService} from './blog.service';

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
            schema: {
              type: 'array',
              items: getModelSchemaRef(BlogCategoryRepository),
            },
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
