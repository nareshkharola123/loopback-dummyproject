import {RequestHandler} from 'express-serve-static-core';

export type FileUploadHandler = RequestHandler;

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: string;
  path: string;
}

export interface FileUploadDATA {
  files: File[];
  fields: object;
}
