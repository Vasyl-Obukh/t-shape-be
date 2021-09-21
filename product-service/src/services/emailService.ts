import { SNS } from 'aws-sdk';
import { logger } from '@utils/logger';

export class EmailService {
  private static instance: EmailService;
  private sns: SNS;
  private emailTopicARN: string;

  constructor(sns, emailTopicARN) {
    this.sns = sns;
    this.emailTopicARN = emailTopicARN;
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService(
        new SNS({ region: process.env.SNS_REGION }),
        process.env.SNS_ARN
      );
    }
    return EmailService.instance;
  }

  async sendEmail(Subject: string, Message: string, productsPrice: number) {
    try {
      await this.sns
        .publish({
          Subject,
          Message,
          TargetArn: this.emailTopicARN,
          MessageAttributes: {
            productsPrice: {
              DataType: 'Number',
              StringValue: productsPrice.toString()
            }
          }
        })
        .promise();
      logger.info('An email was sent!', { Subject, Message, productsPrice });
    } catch (err) {
      logger.error('Error occured during sending an email', {
        Subject,
        Message,
        productsPrice,
        err
      });
      throw err;
    }
  }
}

export default EmailService.getInstance();
