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
import multer from 'multer';
import path from 'path';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {FILE_UPLOAD_SERVICE} from './keys';
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
    // set up directory Blog Image
    this.static('/images', path.join(__dirname, '../images'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Configure file upload with multer options
    this.configureFileUpload(options.fileStorageDirectory);

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

  /**
   * Configure `multer` options for file upload
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected configureFileUpload(destination?: string) {
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'images');
        },
        filename: (req, file, cb) => {
          cb(null, new Date().toISOString() + '-' + file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}
