import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Blog} from '../blog/blog.model';
import {User} from '../users/user.model';

@model()
export class BlogCategory extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  title: string;

  @hasMany(() => Blog)
  blogs: Blog[];

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<BlogCategory>) {
    super(data);
  }
}

export interface BlogCategoryRelations {
  // describe navigational properties here
}

export type BlogCategoryWithRelations = BlogCategory & BlogCategoryRelations;
