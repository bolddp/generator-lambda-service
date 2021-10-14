import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  Callback,
  Context,
} from 'aws-lambda';

export const apiHandler = <T>(
  fnc: (event: APIGatewayProxyEvent) => Promise<T>
) => {
  return async (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback
  ) => {
    try {
      const result = await fnc(event);
      const response: APIGatewayProxyResultV2 = {
        statusCode: 200,
      };
      if (result) {
        response.body = JSON.stringify(result);
      }
      callback(undefined, response);
    } catch (error: any) {
      callback(error);
    }
  };
};
