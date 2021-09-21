import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    stage: 'dev',
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
      CATALOG_ITEMS_QUEUE_URL: '${cf:product-service-${self:provider.stage}.catalogItemsQueueURL}',
      BUCKET_REGION: 'eu-west-1',
      BUCKET_NAME: 'vo-t-shape-import-service',
      UPLOAD_FOLDER: 'uploaded',
      PARSED_FOLDER: 'parsed',
      SIGNED_URL_EXPIRATION: '60',
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: ['arn:aws:s3:::vo-t-shape-import-service'],
          },
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: ['arn:aws:s3:::vo-t-shape-import-service/*'],
          },
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: ['${cf:product-service-${self:provider.stage}.catalogItemsQueueArn}'],
          },
        ],
      },
    },
  },
  functions: {
    importFileParser,
    importProductsFile,
  },
};

module.exports = serverlessConfiguration;
