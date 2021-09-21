import 'source-map-support/register';

import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import productService from '@services/productService';
import { middyfy } from '@libs/lambda';
import { logger } from '@utils/logger';
import validator from '@middy/validator';
import productSchema from './product-shema';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof productSchema> = async (
  event
) => {
  try {
    const product = await productService.create(event.body);

    return formatJSONResponse(product, 201);
  } catch (e) {
    logger.error({ message: e?.message, error: e });

    return formatJSONResponse(
      {
        message: `Something went wrong during creation...`
      },
      500
    );
  }
};

export const main = middyfy(createProduct).use(
  validator({
    inputSchema: productSchema,
    ajvOptions: {
      messages: true
    }
  })
);
