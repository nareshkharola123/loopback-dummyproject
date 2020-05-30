import {bind, /* inject, */ BindingScope, Provider} from '@loopback/core';

/*
 * Fix the service type. Possible options can be:
 * - import {BlogCategory} from 'your-module';
 * - export type BlogCategory = string;
 * - export interface BlogCategory {}
 */
export type BlogCategory = unknown;

@bind({scope: BindingScope.TRANSIENT})
export class BlogCategoryProvider implements Provider<BlogCategory> {
  constructor(/* Add @inject to inject parameters */) {}

  value() {
    // Add your implementation here
    throw new Error('To be implemented');
  }
}
