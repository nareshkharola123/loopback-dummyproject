import {bind, BindingScope} from '@loopback/core';
import {
  Count,
  DataObject,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
// custom imports
import {Blog} from '../models';
import {BlogCategoryRepository, BlogRepository} from '../repositories';

@bind({scope: BindingScope.TRANSIENT})
export class BlogService {
  constructor(
    @repository(BlogRepository)
    public blogRepository: BlogRepository,
    @repository(BlogCategoryRepository)
    public blogCategoryRepository: BlogCategoryRepository,
  ) {}

  async create(blog: DataObject<Blog>): Promise<Blog> {
    try {
      await this.blogCategoryRepository.findById(blog.blogCategoryId);
      return await this.blogRepository.create(blog);
    } catch (error) {
      throw new HttpErrors.BadRequest(error);
    }
  }

  async count(where?: Where<Blog>): Promise<Count> {
    return this.blogRepository.count(where);
  }

  async find(filter?: Filter<Blog>): Promise<Blog[]> {
    return this.blogRepository.find(filter);
  }

  async updateAll(blog: Blog, where?: Where<Blog>): Promise<Count> {
    return this.blogRepository.updateAll(blog, where);
  }

  async findById(
    id: number,
    filter?: FilterExcludingWhere<Blog>,
  ): Promise<Blog> {
    return this.blogRepository.findById(id, filter);
  }

  async updateById(id: number, blog: Blog): Promise<void> {
    await this.blogRepository.updateById(id, blog);
  }

  async replaceById(id: number, blog: Blog): Promise<void> {
    return this.blogRepository.replaceById(id, blog);
  }

  async deleteById(id: number): Promise<void> {
    return this.blogRepository.deleteById(id);
  }
}
