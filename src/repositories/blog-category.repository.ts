import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {BlogCategory, BlogCategoryRelations, Blog, User} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {BlogRepository} from './blog.repository';
import {UserRepository} from './user.repository';

export class BlogCategoryRepository extends DefaultCrudRepository<
  BlogCategory,
  typeof BlogCategory.prototype.id,
  BlogCategoryRelations
> {

  public readonly blogs: HasManyRepositoryFactory<Blog, typeof BlogCategory.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof BlogCategory.prototype.id>;

  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource, @repository.getter('BlogRepository') protected blogRepositoryGetter: Getter<BlogRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(BlogCategory, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.blogs = this.createHasManyRepositoryFactoryFor('blogs', blogRepositoryGetter,);
    this.registerInclusionResolver('blogs', this.blogs.inclusionResolver);
  }
}
