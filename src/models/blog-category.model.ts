import {Entity, model, property, hasMany} from '@loopback/repository';
import {Blog} from './blog.model';

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
  })
  title: string;

  @hasMany(() => Blog)
  blogs: Blog[];

  constructor(data?: Partial<BlogCategory>) {
    super(data);
  }
}

export interface BlogCategoryRelations {
  // describe navigational properties here
}

export type BlogCategoryWithRelations = BlogCategory & BlogCategoryRelations;
