import {Request} from '@loopback/rest';
import {FileUploadDATA} from '../types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getFilesAndFields = (request: Request): FileUploadDATA => {
  // const uploadedFiles = request.files;
  const files = JSON.parse(JSON.stringify(request.files));
  return {files, fields: JSON.parse(JSON.stringify(request.body))};
};
