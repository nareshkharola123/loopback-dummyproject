// Uncomment these imports to begin using these cool features!

import {authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {OPERATION_SECURITY_SPEC} from '../auth/specs/security-spec';
import {
  Credential,
  CredentialsSchema,
} from '../auth/specs/user-controller.specs';
import {UserType} from './type';
import {User} from './user.model';
import {UserService} from './user.service';

export class UserController {
  constructor(@service(UserService) public userService: UserService) {}

  @post('/sign-up', {
    responses: {
      '201': {
        description: 'User successfully Sign Up!',
        content: {
          'application/json': {
            exclude: ['roles', 'id', 'sex', 'name', 'bio', 'dob', 'password'],
            schema: getModelSchemaRef(User, {}),
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            exclude: ['roles'],
          }),
        },
      },
    })
    user: User,
  ): Promise<string> {
    return this.userService.create(user);
  }

  @get('/users', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  // @authorize()
  async getUsers(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User[]> {
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

  // todo: add admin role here
  @post('/staff/create-user', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User Created!',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  @authenticate('jwt')
  async createStaff(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            exclude: ['roles'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<UserType> {
    return this.userService.createStaffUser(user);
  }
}
