import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import inputOutputLogger from '@middy/input-output-logger';
import httpErrorHandler from '@middy/http-error-handler';
import { dbConnectMiddleware } from './middleware/DBConnectMiddleware';
import { logger } from '@utils/logger';

export const middyfy = (handler) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(inputOutputLogger({ logger: logger.info.bind(logger) }))
    .use(
      httpErrorHandler({
        logger: logger.error.bind(logger),
        fallbackMessage: 'Error during execution'
      })
    )
    .use(dbConnectMiddleware());
};
