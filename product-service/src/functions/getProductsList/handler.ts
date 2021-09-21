import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import productService from '@services/productService';
import { middyfy } from '@libs/lambda';
import { logger } from '@utils/logger';

export const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    const products = await productService.getAll();

    return formatJSONResponse(products);
  } catch (e) {
    logger.error({ message: e?.message, error: e });

    return formatJSONResponse(
      {
        message: `Something went wrong during search...`
      },
      500
    );
  }
};

export const main = middyfy(getProductsList);
