import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgresdbDataSource} from '../../datasources';
import {Blog} from '../blog/blog.model';
import {BlogRepository} from '../blog/blog.repository';
import {User} from '../users/user.model';
import {UserRepository} from '../users/user.repository';
import {BlogCategory, BlogCategoryRelations} from './blog-category.model';

export class BlogCategoryRepository extends DefaultCrudRepository<
  BlogCategory,
  typeof BlogCategory.prototype.id,
  BlogCategoryRelations
> {
  public readonly blogs: HasManyRepositoryFactory<
    Blog,
    typeof BlogCategory.prototype.id
  >;

  public readonly user: BelongsToAccessor<
    User,
    typeof BlogCategory.prototype.id
  >;

  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
    @repository.getter('BlogRepository')
    protected blogRepositoryGetter: Getter<BlogRepository>,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(BlogCategory, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.blogs = this.createHasManyRepositoryFactoryFor(
      'blogs',
      blogRepositoryGetter,
    );
    this.registerInclusionResolver('blogs', this.blogs.inclusionResolver);
  }
}
