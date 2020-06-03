// import {Blog, BlogRelations, BlogCategory} from '../models';
// import {PostgresdbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {PostgresdbDataSource} from '../../datasources';
import {BlogCategory} from '../blog-category/blog-category.model';
import {BlogCategoryRepository} from '../blog-category/blog-category.repository';
import {Blog, BlogRelations} from './blog.model';

export class BlogRepository extends DefaultCrudRepository<
  Blog,
  typeof Blog.prototype.id,
  BlogRelations
> {
  public readonly blogCategory: BelongsToAccessor<
    BlogCategory,
    typeof Blog.prototype.id
  >;

  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
    @repository.getter('BlogCategoryRepository')
    protected blogCategoryRepositoryGetter: Getter<BlogCategoryRepository>,
  ) {
    super(Blog, dataSource);
    this.blogCategory = this.createBelongsToAccessorFor(
      'blogCategory',
      blogCategoryRepositoryGetter,
    );
    this.registerInclusionResolver(
      'blogCategory',
      this.blogCategory.inclusionResolver,
    );
  }
}
