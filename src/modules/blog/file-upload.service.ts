import {
  bind,
  BindingScope,
  config,
  ContextTags,
  Provider,
} from '@loopback/core';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import {FILE_UPLOAD_SERVICE} from '../../keys';
import {FileUploadHandler} from '../../types';

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_ID,
  region: process.env.REGION,
});

const s3 = new aws.S3();
/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@bind({
  scope: BindingScope.TRANSIENT,
  tags: {[ContextTags.KEY]: FILE_UPLOAD_SERVICE},
})
export class FileUploadProvider implements Provider<FileUploadHandler> {
  constructor(@config() private options: multer.Options = {}) {
    if (!this.options.storage) {
      this.options.storage = multer.memoryStorage();
    }
  }

  value(): FileUploadHandler {
    this.options.storage = multerS3({
      s3: s3,
      acl: 'public-read',
      bucket: process.env.BUCKET_NAME ?? '',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString());
      },
    });
    return multer(this.options).any();
  }
}
