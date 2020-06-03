import {belongsTo, Entity, model, property} from '@loopback/repository';
import {BlogCategory} from '../blog-category/blog-category.model';

@model()
export class Blog extends Entity {
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

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => BlogCategory)
  blogCategoryId: number;

  constructor(data?: Partial<Blog>) {
    super(data);
  }
}

export interface BlogRelations {
  // describe navigational properties here
}

export type BlogWithRelations = Blog & BlogRelations;
