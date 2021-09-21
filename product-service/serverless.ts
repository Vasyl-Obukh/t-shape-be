import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  useDotenv: true,
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SNS_REGION: 'eu-west-1',
      SNS_ARN: { Ref: 'SNSCatalogBatchProcessTopic' },
      PG_HOST: 'vo-t-shape-db.cxkbjesfkzfq.eu-west-1.rds.amazonaws.com',
      PG_PORT: '5432',
      PG_DATABASE: 'votshapedb',
      PG_USERNAME: 'postgres',
      PG_PASSWORD: '123qwerty'
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: { Ref: 'SNSCatalogBatchProcessTopic' },
      },
    ],
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      SNSCatalogBatchProcessTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'catalog-batch-process-topic',
        },
      },
      SNSCatalogBatchProcessSubscriptionLowPrice: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:LOW_PRICE_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSCatalogBatchProcessTopic',
          },
          FilterPolicy: {
            productsPrice: [{ numeric: ['<=', 25000] }],
          },
        },
      },
      SNSCatalogBatchProcessSubscriptionHighPrice: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:HIGH_PRICE_EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSCatalogBatchProcessTopic',
          },
          FilterPolicy: {
            productsPrice: [{ numeric: ['>', 25000] }],
          },
        },
      },
    },
    Outputs: {
      catalogItemsQueueArn: {
        Value: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
        Export: {
          Name: 'catalogItemsQueueArn',
        },
      },
      catalogItemsQueueURL: {
        Value: { Ref: 'catalogItemsQueue' },
        Export: {
          Name: 'catalogItemsQueueURL',
        },
      },
    },
  },
  functions: {
    getProductsList,
    getProductsById,
    createProduct,
    catalogBatchProcess,
  },
};

module.exports = serverlessConfiguration;
