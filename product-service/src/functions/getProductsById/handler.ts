import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import ProductService from '@services/productService';
import { logger } from '@utils/logger';

const UUIDRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const getProductsById: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return formatJSONResponse(
      {
        message: 'Error: Mandatory path parameter id is missed'
      },
      404
    );
  }

  if (!UUIDRegExp.test(id)) {
    return formatJSONResponse(
      {
        message: `Error: Incorrect id fromat: ${id}`
      },
      404
    );
  }

  try {
    const product = await ProductService.getById(id);

    if (!product) {
      return formatJSONResponse(
        {
          message: `Can't find product with id: ${id}`
        },
        404
      );
    }

    return formatJSONResponse(product);
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

export const main = middyfy(getProductsById);
