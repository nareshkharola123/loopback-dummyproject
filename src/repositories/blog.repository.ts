import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Blog, BlogRelations, BlogCategory} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {BlogCategoryRepository} from './blog-category.repository';

export class BlogRepository extends DefaultCrudRepository<
  Blog,
  typeof Blog.prototype.id,
  BlogRelations
> {

  public readonly blogCategory: BelongsToAccessor<BlogCategory, typeof Blog.prototype.id>;

  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource, @repository.getter('BlogCategoryRepository') protected blogCategoryRepositoryGetter: Getter<BlogCategoryRepository>,
  ) {
    super(Blog, dataSource);
    this.blogCategory = this.createBelongsToAccessorFor('blogCategory', blogCategoryRepositoryGetter,);
    this.registerInclusionResolver('blogCategory', this.blogCategory.inclusionResolver);
  }
}
