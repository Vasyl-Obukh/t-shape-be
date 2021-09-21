import 'source-map-support/register';

import { SQSHandler } from 'aws-lambda/trigger/sqs';
import productService from '@services/productService';
import emailService from '@services/emailService';
import { middyfy } from '@libs/lambda';
import { logger } from '@utils/logger';
import IProduct from '@data/interfaces/IProduct';

export const catalogBatchProcess: SQSHandler = async (event) => {
  try {
    const parsedProducts: Omit<IProduct, 'id'>[] = event.Records.map(({ body }) =>
      JSON.parse(body)
    );

    for (const product of parsedProducts) {
      try {
        await productService.create(product);
        logger.info('Product was successfully imported', product);
      } catch (error) {
        logger.error('An error occured during importing product', { error, product });
      }
    }

    const productsPrice = parsedProducts.reduce(
      (acc, product) => acc + product.count * product.price,
      0
    );
    await emailService.sendEmail(
      'Product batch process is completed',
      'Congratulations! The products were successfully imported!',
      productsPrice
    );
  } catch (error) {
    logger.error('An error occured during importing products', error);
  }
};

export const main = middyfy(catalogBatchProcess);
