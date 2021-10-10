import { Response } from 'express';
import { Singleton } from '../utils/Singleton';

export class ErrorHandler {
  handle(rsp: Response, error: any): void {
    let statusCode: number = 500;
    let errorCode: number = 500;
    let message: string = error.message || 'Internal error';

    if (error.statusCode) {
      statusCode = error.statusCode < 1000 ? error.statusCode : 400;
      errorCode = error.statusCode;
    }
    const outboundError = {
      errorCode,
      message,
      metaData: error.metaData,
    };

    console.error(`Error! ${JSON.stringify(outboundError)}`);
    rsp.status(statusCode).json(outboundError);
  }
}

export const errorHandlerFactory = new Singleton(
  () => new ErrorHandler(),
  'ErrorHandler'
);
