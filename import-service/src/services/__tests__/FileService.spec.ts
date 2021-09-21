import { FileService } from '../FileService';
import * as AWS from 'aws-sdk';
import { mocked } from 'ts-jest/utils';
import { logger } from '@utils/logger';

jest.mock('aws-sdk');
jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn()
  }
}));

describe('FileService', () => {
  describe('createSignedURL', () => {
    const signedURL = 'signedURL';
    const bucketName = 'bucketName';
    const bucketRegion = 'bucketRegion';
    const uploadFolder = 'uploadFolder';
    const signedUrlExpiration = 60;

    it('should throw validation error if passed parameter is less than 4 characters', async () => {
      const fileName = 'fileName';
      const imageService = new FileService(
        bucketName,
        bucketRegion,
        uploadFolder,
        'parsedFolder',
        signedUrlExpiration
      );

      const params = {
        Bucket: bucketName,
        Key: `${uploadFolder}/${fileName}`,
        Expires: 60,
        ContentType: 'text/csv'
      };

      const mockGetSignedUrlPromise = jest.fn();
      mockGetSignedUrlPromise.mockReturnValue(signedURL);
      mocked<any>(AWS.S3).mockImplementation(() => ({
        getSignedUrlPromise: mockGetSignedUrlPromise
      }));

      const result = await imageService.createSignedURL(fileName);

      expect(result).toBe(signedURL);

      expect(logger.info).toBeCalledWith({
        message: 'Creating new signed URL with params',
        params
      });

      expect(mockGetSignedUrlPromise).toHaveBeenCalledWith('putObject', params);

      expect(AWS.S3).toHaveBeenCalledWith({
        region: bucketRegion,
        signatureVersion: 'v4'
      });
    });
  });
});
