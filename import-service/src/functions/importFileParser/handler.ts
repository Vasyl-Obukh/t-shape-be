import 'source-map-support/register';

import type { S3EventHandler } from '@libs/apiGateway';
import { middyfyErrLogger } from '@libs/lambda';
import defaultFileService from '@services/FileService';

const importFileParser: S3EventHandler = async (event) => {
  for (const record of event.Records) {
    await defaultFileService.parseFile(record.s3.object.key);
  }

  return {
    statusCode: 200
  };
};

export const main = middyfyErrLogger(importFileParser);
