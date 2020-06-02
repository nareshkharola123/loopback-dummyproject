// Uncomment these imports to begin using these cool features!

import {service} from '@loopback/core';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {User} from '../models';
import {UserService} from '../services';
import {Credential, CredentialsSchema} from './specs/user-controller.specs';

// import {inject} from '@loopback/context';

export class UserController {
  constructor(@service(UserService) public userService: UserService) {}

  @post('/sign-up', {
    responses: {
      '201': {
        description: 'User successfully Sign Up!',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async signUp(
    @requestBody({
      'application/json': {
        schema: getModelSchemaRef(User),
      },
    })
    user: User,
  ): Promise<string> {
    return this.userService.create(user);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'All Users!',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User),
            },
          },
        },
      },
    },
  })
  async getUsers(): Promise<User[]> {
    return this.userService.allUsers();
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      description: 'The Input Of Login Function!',
      required: true,
      content: {
        'appliction/json': {schema: CredentialsSchema},
      },
    })
    credentials: Credential,
  ): Promise<{token: string}> {
    return this.userService.logIn(credentials);
  }
}
