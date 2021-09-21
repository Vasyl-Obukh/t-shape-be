import { importProductsFile } from '../handler';
import { formatJSONResponse } from '@libs/apiGateway';
import defaultFileService from '@services/FileService';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { mocked } from 'ts-jest/utils';
import { logger } from '@utils/logger';

jest.mock('@libs/lambda');
jest.mock('@utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

jest.mock('@services/FileService', () => ({
  default: {
    createSignedURL: jest.fn()
  }
}));

describe('ImportProductFileHandler', () => {
  it('should return error message with 400 code if passed name is not correct', async () => {
    const event = {
      queryStringParameters: {
        name: '1.1'
      } as APIGatewayProxyEventQueryStringParameters
    } as APIGatewayProxyEvent;

    const result = await importProductsFile(event, null, null);

    expect(result).toEqual(
      formatJSONResponse(
        {
          message: 'File name is not provided correctly!'
        },
        400
      )
    );
  });

  it('should return created signed url', async () => {
    const signedURL = 'signedURL/test.csv';
    const event = {
      queryStringParameters: {
        name: 'test.csv'
      } as APIGatewayProxyEventQueryStringParameters
    } as APIGatewayProxyEvent;

    mocked(defaultFileService.createSignedURL).mockResolvedValueOnce(signedURL);

    const result = await importProductsFile(event, null, null);

    expect(result).toEqual(formatJSONResponse(signedURL, 201));
  });

  it('should return error response with 500 error code and log error', async () => {
    const event = {
      queryStringParameters: {
        name: 'test.csv'
      } as APIGatewayProxyEventQueryStringParameters
    } as APIGatewayProxyEvent;

    const error = new Error('Bad Connection');

    mocked(defaultFileService.createSignedURL).mockRejectedValueOnce(error);

    const result = await importProductsFile(event, null, null);

    expect(result).toEqual(
      formatJSONResponse(
        {
          message: 'Something went wrong during creation of signed URL...'
        },
        500
      )
    );

    expect(logger.error).toBeCalledWith({
      message: 'Error during creation of signed URL...',
      errorMessage: error?.message,
      error
    });
  });
});
