import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Blog,
  BlogCategory,
} from '../models';
import {BlogRepository} from '../repositories';

export class BlogBlogCategoryController {
  constructor(
    @repository(BlogRepository)
    public blogRepository: BlogRepository,
  ) { }

  @get('/blogs/{id}/blog-category', {
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
  async getBlogCategory(
    @param.path.number('id') id: typeof Blog.prototype.id,
  ): Promise<BlogCategory> {
    return this.blogRepository.blogCategory(id);
  }
}
