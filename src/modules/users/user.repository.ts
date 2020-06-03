import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgresdbDataSource} from '../../datasources';
import {BlogCategory} from '../blog-category/blog-category.model';
import {BlogCategoryRepository} from '../blog-category/blog-category.repository';
import {User, UserRelations} from './user.model';
// import {BlogCategoryRepository} from './blog-category.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly blogCategories: HasManyRepositoryFactory<
    BlogCategory,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
    @repository.getter('BlogCategoryRepository')
    protected blogCategoryRepositoryGetter: Getter<BlogCategoryRepository>,
  ) {
    super(User, dataSource);
    this.blogCategories = this.createHasManyRepositoryFactoryFor(
      'blogCategories',
      blogCategoryRepositoryGetter,
    );
    this.registerInclusionResolver(
      'blogCategories',
      this.blogCategories.inclusionResolver,
    );
  }
}
