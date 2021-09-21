import { logger } from '@utils/logger';
import middy from '@middy/core';
import DBClientManager from '@data/access/DBClientManager';

export const dbConnectMiddleware: middy.Middleware<DBClientManager> = (
  dbClientManager = DBClientManager.getInstance()
) => ({
  before: async () => {
    logger.info({ message: 'Start connection to DB' });
    await dbClientManager.connect();
    logger.info({ message: 'Successfully connected to DB' });
  },
  after: async () => {
    logger.info({ message: 'Start disconnection from DB' });
    await dbClientManager.disconnect();
    logger.info({ message: 'Successfully disconnected from DB' });
  },
  onError: async () => {
    logger.error({ message: 'Start disconnection from DB due to error' });
    await dbClientManager.disconnect();
    logger.error({ message: 'Successfully disconnected from DB due to error' });
  }
});
