import {bind, BindingScope, inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import _ from 'lodash';
import {Credential} from '../controllers/specs/user-controller.specs';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {validateUser} from '../utils';
import {compareCredentials} from '../utils/compare-credentials';
import {convertToUserProfile} from '../utils/convet-to-userProfile';
import {PasswordHasher} from './hash.password.bcryptjs';
import {JwtService} from './jwt.service';

@bind({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject('service.hasher')
    public passwordHasher: PasswordHasher,
    @service(JwtService)
    public jwtService: JwtService,
  ) {}

  async create(user: User): Promise<string> {
    //validation email and password
    validateUser(_.pick(user, ['email', 'password']));

    //password encryption
    const password = await this.passwordHasher.hashPassword(user.password);
    user.password = password;
    try {
      const userObject = await this.userRepository.create(user);
      return userObject.email;
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(error);
    }
  }

  async allUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByEmail(email: string): Promise<User> {
    const userObject = await this.userRepository.findOne({
      where: {email: email},
    });

    if (!userObject) {
      throw new HttpErrors.UnprocessableEntity('User Not Exist!');
    }
    return userObject;
  }

  async logIn(credentials: Credential): Promise<{token: string}> {
    //check user exist
    const user = await this.findUserByEmail(credentials.email);

    //password matching
    const passwordMatched = await compareCredentials(
      credentials.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Incorrect Credentials!');
    }

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = convertToUserProfile(user);

    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }
}
