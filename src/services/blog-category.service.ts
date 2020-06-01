import {bind, BindingScope} from '@loopback/core';
import {
  Count,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {BlogCategory} from '../models';
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
}
