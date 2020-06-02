import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, BlogCategory} from '../models';
import {PostgresdbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {BlogCategoryRepository} from './blog-category.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly blogCategories: HasManyRepositoryFactory<BlogCategory, typeof User.prototype.id>;

  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource, @repository.getter('BlogCategoryRepository') protected blogCategoryRepositoryGetter: Getter<BlogCategoryRepository>,
  ) {
    super(User, dataSource);
    this.blogCategories = this.createHasManyRepositoryFactoryFor('blogCategories', blogCategoryRepositoryGetter,);
    this.registerInclusionResolver('blogCategories', this.blogCategories.inclusionResolver);
  }
}
