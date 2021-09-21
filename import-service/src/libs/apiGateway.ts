import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, S3Event } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export type S3EventHandler = Handler<S3Event, { statusCode: number }>;

export const formatJSONResponse = (response, statusCode = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response)
  };
};
