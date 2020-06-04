import {AuthenticationComponent} from '@loopback/authentication';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {BcryptHasher} from './modules/auth/hash.password.bcryptjs';
import {MySequence} from './sequence';
import {
  BlogCategoryService,
  BlogService,
  JwtService,
  UserService,
} from './services';

export {ApplicationConfig};

export class TBlogApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.setUpBindings();

    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    // authentication
    this.add(createBindingFromClass(JWTAuthenticationStrategy));

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers', 'modules'],
        extensions: ['.controller.js'],
        nested: true,
      },
      repositories: {
        dirs: ['repositories', 'modules'],
        extensions: ['.repository.js'],
        nested: true,
      },
      services: {
        dirs: ['vendors', 'services', 'modules'],
        extensions: ['.service.js'],
        nested: true,
      },
    };
  }
  setUpBindings(): void {
    // Bind bcrypt has services
    this.bind('service.hasher').toClass(BcryptHasher);
    this.bind('service.jwtService').toClass(JwtService);
    this.bind('service.userService').toClass(UserService);
    this.bind('service.blogService').toClass(BlogService);
    this.bind('service.blogCategoryService').toClass(BlogCategoryService);
  }
}
