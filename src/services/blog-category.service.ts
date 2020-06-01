import {bind, BindingScope} from '@loopback/core';
import {
  Count,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {Blog, BlogCategory} from '../models';
import {BlogCategoryRepository} from '../repositories';

@bind({scope: BindingScope.TRANSIENT})
export class BlogCategoryService {
  constructor(
    @repository(BlogCategoryRepository)
    public blogCategoryRepository: BlogCategoryRepository,
  ) {}

  async create(blogCategory: BlogCategory): Promise<BlogCategory> {
    return this.blogCategoryRepository.create(blogCategory);
  }

  async count(where?: Where<BlogCategory>): Promise<Count> {
    return this.blogCategoryRepository.count(where);
  }

  async find(filter?: Filter<BlogCategory>): Promise<BlogCategory[]> {
    return this.blogCategoryRepository.find(filter);
  }

  async updateAll(
    blogCategory: BlogCategory,
    where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.blogCategoryRepository.updateAll(blogCategory, where);
  }

  async findById(
    id: number,
    filter?: FilterExcludingWhere<BlogCategory>,
  ): Promise<BlogCategory> {
    return this.blogCategoryRepository.findById(id, filter);
  }

  async updateById(id: number, blogCategory: BlogCategory): Promise<void> {
    await this.blogCategoryRepository.updateById(id, blogCategory);
  }

  async replaceById(id: number, blogCategory: BlogCategory): Promise<void> {
    await this.blogCategoryRepository.replaceById(id, blogCategory);
  }

  async deleteById(id: number): Promise<void> {
    await this.blogCategoryRepository.deleteById(id);
  }

  async blogsFindByBlogCategory(
    id: number,
    filter?: Filter<Blog>,
  ): Promise<Blog[]> {
    return this.blogCategoryRepository.blogs(id).find(filter);
  }

  async blogsCreateByBlogCategory(
    id: typeof BlogCategory.prototype.id,
    blog: Blog,
  ): Promise<Blog> {
    return this.blogCategoryRepository.blogs(id).create(blog);
  }

  async blogsPatchByBlogCategory(
    id: number,
    blog: Partial<Blog>,
    where?: Where<Blog>,
  ): Promise<Count> {
    return this.blogCategoryRepository.blogs(id).patch(blog, where);
  }

  async blogsDeleteByBlogCategory(
    id: number,
    where?: Where<Blog>,
  ): Promise<Count> {
    return this.blogCategoryRepository.blogs(id).delete(where);
  }
}
