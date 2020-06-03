import {Entity, hasMany, model, property} from '@loopback/repository';
import {BlogCategory} from '../blog-category/blog-category.model';

@model()
export class User extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  sex: string;

  @property({
    type: 'date',
    required: true,
  })
  dob: string;

  @property({
    type: 'string',
  })
  bio?: string;

  @hasMany(() => BlogCategory)
  blogCategories: BlogCategory[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
