import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {BlogCategory, BlogCategoryRelations, Blog} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {BlogRepository} from './blog.repository';

export class BlogCategoryRepository extends DefaultCrudRepository<
  BlogCategory,
  typeof BlogCategory.prototype.id,
  BlogCategoryRelations
> {

  public readonly blogs: HasManyRepositoryFactory<Blog, typeof BlogCategory.prototype.id>;

  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource, @repository.getter('BlogRepository') protected blogRepositoryGetter: Getter<BlogRepository>,
  ) {
    super(BlogCategory, dataSource);
    this.blogs = this.createHasManyRepositoryFactoryFor('blogs', blogRepositoryGetter,);
    this.registerInclusionResolver('blogs', this.blogs.inclusionResolver);
  }
}
