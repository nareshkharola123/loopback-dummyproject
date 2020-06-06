import {bind, BindingScope, inject} from '@loopback/core';
import {
  Count,
  DataObject,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE} from '../../keys';
import {File, FileUploadHandler} from '../../types';
import {BlogCategory} from '../blog-category/blog-category.model';
import {BlogCategoryRepository} from '../blog-category/blog-category.repository';
import {Blog} from './blog.model';
import {BlogRepository} from './blog.repository';

@bind({scope: BindingScope.TRANSIENT})
export class BlogService {
  constructor(
    @repository(BlogRepository)
    public blogRepository: BlogRepository,
    @repository(BlogCategoryRepository)
    public blogCategoryRepository: BlogCategoryRepository,
    @inject(FILE_UPLOAD_SERVICE) public handler: FileUploadHandler,
  ) {}

  async create(blog: DataObject<Blog>, files: File[]): Promise<Blog> {
    if (files.length > 0) blog.imageURL = files[0].path;
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

  async updateAll(
    blog: DataObject<Blog>,
    files: File[],
    where?: Where<Blog>,
  ): Promise<Count> {
    if (files.length > 0) blog.imageURL = files[0].path;
    return this.blogRepository.updateAll(blog, where);
  }

  async findById(
    id: number,
    filter?: FilterExcludingWhere<Blog>,
  ): Promise<Blog> {
    return this.blogRepository.findById(id, filter);
  }

  async updateById(
    id: number,
    blog: DataObject<Blog>,
    files: File[],
  ): Promise<void> {
    if (files.length > 0) blog.imageURL = files[0].path;
    await this.blogRepository.updateById(id, blog);
  }

  async replaceById(
    id: number,
    blog: DataObject<Blog>,
    files: File[],
  ): Promise<void> {
    try {
      if (files.length > 0) blog.imageURL = files[0].path;
      return await this.blogRepository.replaceById(id, blog);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(err);
    }
  }

  async deleteById(id: number): Promise<void> {
    return this.blogRepository.deleteById(id);
  }

  async getBlogCategoryByBlog(
    id: typeof Blog.prototype.id,
  ): Promise<BlogCategory> {
    return this.blogRepository.blogCategory(id);
  }
}
