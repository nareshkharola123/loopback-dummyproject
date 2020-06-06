import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {RoleKey} from '../../enums/role.enum';
import {FILE_UPLOAD_SERVICE} from '../../keys';
import {FileUploadDATA, FileUploadHandler} from '../../types';
import {getFilesAndFields} from '../../utils/file-upload';
import {basicAuthorization} from '../auth/basic.authorization';
import {OPERATION_SECURITY_SPEC} from '../auth/specs/security-spec';
import {Blog} from './blog.model';
import {BlogService} from './blog.service';

export class BlogController {
  constructor(
    @service(BlogService)
    public blogService: BlogService,
    @inject(FILE_UPLOAD_SERVICE) public handler: FileUploadHandler,
  ) {}

  @post('/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Blog model instance',
        content: {'application/json': {schema: getModelSchemaRef(Blog)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async create(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              imageURL: {
                type: 'string',
                format: 'binary',
              },
              description: {
                type: 'string',
              },
              blogCategoryId: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Blog> {
    const blogData = new Promise<FileUploadDATA>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request));
        }
      });
    });
    const result = await blogData;
    return this.blogService.create(result.fields, result.files);
  }

  @get('/blogs/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Blog model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async count(@param.where(Blog) where?: Where<Blog>): Promise<Count> {
    return this.blogService.count(where);
  }

  @get('/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Blog model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Blog, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async find(@param.filter(Blog) filter?: Filter<Blog>): Promise<Blog[]> {
    return this.blogService.find(filter);
  }

  @patch('/blogs', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Blog PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async updateAll(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              imageURL: {
                type: 'string',
                format: 'binary',
              },
              description: {
                type: 'string',
              },
              blogCategoryId: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.where(Blog) where?: Where<Blog>,
  ): Promise<Count> {
    const blogData = new Promise<FileUploadDATA>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request));
        }
      });
    });
    const result = await blogData;
    return this.blogService.updateAll(result.fields, result.files, where);
  }

  @get('/blogs/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Blog model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Blog, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Blog, {exclude: 'where'}) filter?: FilterExcludingWhere<Blog>,
  ): Promise<Blog> {
    return this.blogService.findById(id, filter);
  }

  @patch('/blogs/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Blog PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              imageURL: {
                type: 'string',
                format: 'binary',
              },
              description: {
                type: 'string',
              },
              blogCategoryId: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    const blogData = new Promise<FileUploadDATA>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request));
        }
      });
    });
    const result = await blogData;
    await this.blogService.updateById(id, result.fields, result.files);
  }

  @put('/blogs/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Blog PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              imageURL: {
                type: 'string',
                format: 'binary',
              },
              description: {
                type: 'string',
              },
              blogCategoryId: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    const blogData = new Promise<FileUploadDATA>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request));
        }
      });
    });
    const result = await blogData;
    await this.blogService.replaceById(id, result.fields, result.files);
  }

  @del('/blogs/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Blog DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: [RoleKey.general],
    voters: [basicAuthorization],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogService.deleteById(id);
  }

  /**
   * Get files and fields for the request
   *  - Http request
   */
  // private static getFilesAndFields(request: Request) {
  //   const uploadedFiles = request.files;
  //   const mapper = (f: globalThis.Express.Multer.File) => ({
  //     fieldname: f.fieldname,
  //     originalname: f.originalname,
  //     encoding: f.encoding,
  //     mimetype: f.mimetype,
  //     size: f.size,
  //   });
  //   let files: object[] = [];
  //   if (Array.isArray(uploadedFiles)) {
  //     files = uploadedFiles.map(mapper);
  //   } else {
  //     for (const filename in uploadedFiles) {
  //       files.push(...uploadedFiles[filename].map(mapper));
  //     }
  //   }
  //   return {files, fields: request.body};
  // }
}
