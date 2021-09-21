// import '@types/jest';

import { mocked } from 'ts-jest/utils';
import { SNS } from 'aws-sdk';
import { EmailService } from '@services/emailService';
import { logger } from '@utils/logger';

jest.mock('@utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn()
  }
}));

describe('EmailService', () => {
  const snsArn = 'MY_SNS_ARN';
  const Subject = 'email subject';
  const Message = 'some message';
  const productsPrice = 20000;

  const publish = jest.fn();
  const snsPromise = jest.fn();
  mocked(snsPromise).mockResolvedValue(null);
  mocked(publish).mockImplementation(() => ({ promise: snsPromise } as any));
  const sns = ({
    publish
  } as unknown) as SNS;

  const emailService = new EmailService(sns, snsArn);

  it('should send email and log info message', async () => {
    await emailService.sendEmail(Subject, Message, productsPrice);

    expect(publish).toHaveBeenCalledWith({
      Subject,
      Message,
      TargetArn: snsArn,
      MessageAttributes: {
        productsPrice: {
          DataType: 'Number',
          StringValue: productsPrice.toString()
        }
      }
    });
    expect(snsPromise).toHaveBeenCalled();

    expect(logger.info).toBeCalledWith('An email was sent!', { Subject, Message, productsPrice });
  });

  it('should send email and log error in case of error', async () => {
    const err = new Error('Bad Connection');

    mocked(snsPromise).mockRejectedValueOnce(err);
    try {
      await emailService.sendEmail(Subject, Message, productsPrice);

      expect(publish).toHaveBeenCalledWith({
        Subject,
        Message,
        TargetArn: snsArn,
        MessageAttributes: {
          productsPrice: {
            DataType: 'Number',
            StringValue: productsPrice.toString()
          }
        }
      });
    } catch (error) {
      expect(error).toEqual(err);
    }

    expect(snsPromise).toHaveBeenCalled();

    expect(logger.error).toBeCalledWith('Error occured during sending an email', {
      Subject,
      Message,
      productsPrice,
      err
    });
  });
});
