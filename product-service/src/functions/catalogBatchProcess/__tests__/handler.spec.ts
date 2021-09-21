import { catalogBatchProcess } from '../handler';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import productService from '@services/productService';
import emailService from '@services/emailService';
import { logger } from '@utils/logger';
import { mocked } from 'ts-jest/utils';

jest.mock('@libs/lambda');
jest.mock('@utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn()
  }
}));

jest.mock('@services/emailService', () => ({
  default: {
    sendEmail: jest.fn()
  }
}));

jest.mock('@services/productService', () => ({
  default: {
    create: jest.fn()
  }
}));

describe('СatalogBatchProcessHandler', () => {
  const product1 = {
    count: 20,
    description: 'HP ENVY x360',
    display: '33',
    imgUrl: 'url',
    price: 1000,
    ram: 8,
    storage: '256 GB SSD storage',
    title: 'HP ENVY x360'
  };
  const product2 = {
    count: 10,
    description: 'Test 2 HP ENVY x360',
    display: '33',
    imgUrl: 'url',
    price: 1500,
    ram: 8,
    storage: '256 GB SSD storage',
    title: 'HP ENVY x360'
  };
  const event = {
    Records: [
      {
        body: JSON.stringify(product1)
      },
      {
        body: JSON.stringify(product2)
      }
    ]
  } as SQSEvent;

  it('should create products parsed from SQS event and send email', async () => {
    await catalogBatchProcess(event, null, null);

    //create
    expect(productService.create).toBeCalledWith(product1);
    expect(logger.info).toBeCalledWith('Product was successfully imported', product1);
    expect(productService.create).toBeCalledWith(product2);
    expect(logger.info).toBeCalledWith('Product was successfully imported', product2);

    // send email
    expect(emailService.sendEmail).toBeCalledWith(
      'Product batch process is completed',
      'Congratulations! The products were successfully imported!',
      35000
    );
  });

  it('should log error if some is occured during batch proccess', async () => {
    const error = new Error('Bad Connection');

    mocked(emailService.sendEmail).mockRejectedValueOnce(error);

    await catalogBatchProcess(event, null, null);

    //create
    expect(productService.create).toBeCalledWith(product1);
    expect(logger.info).toBeCalledWith('Product was successfully imported', product1);
    expect(productService.create).toBeCalledWith(product2);
    expect(logger.info).toBeCalledWith('Product was successfully imported', product2);

    // send email
    expect(emailService.sendEmail).toBeCalledWith(
      'Product batch process is completed',
      'Congratulations! The products were successfully imported!',
      35000
    );

    expect(logger.error).toBeCalledWith('An error occured during importing products', error);
  });
});
