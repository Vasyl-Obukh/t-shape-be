import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import defaultFileService from '@services/FileService';
import { logger } from '@utils/logger';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
  try {
    const fileName = event.queryStringParameters.name;
    if (fileName?.length < 4) {
      return formatJSONResponse(
        {
          message: 'File name is not provided correctly!'
        },
        400
      );
    }

    const signedURL = await defaultFileService.createSignedURL(fileName);

    return formatJSONResponse(signedURL, 201);
  } catch (e) {
    logger.error({
      message: 'Error during creation of signed URL...',
      errorMessage: e?.message,
      error: e
    });

    return formatJSONResponse(
      {
        message: 'Something went wrong during creation of signed URL...'
      },
      500
    );
  }
};

export const main = middyfy(importProductsFile);
