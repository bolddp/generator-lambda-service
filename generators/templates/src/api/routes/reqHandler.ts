import { Request, Response } from 'express';
import { Log } from '../../utils/Log';
import { ErrorHandler } from '../ErrorHandler';

export type ReqHandler<T> = (req?: Request) => Promise<T>;
export type ReqRspHandler<T> = (req: Request, rsp: Response) => Promise<T>;

const log = new Log('http');

/**
 * Request handler that sends along the response from the handler function in a 200 HTTP response.
 * If a specialized response is necessary, e.g. some other HTTP status code, use function reqRspHandler instead.
 */
export function reqHandler<T>(
  errorHandler: ErrorHandler,
  fnc: ReqHandler<T>
): ReqRspHandler<void> {
  return async (req, rsp) => {
    log.debugFn(() => `${req.method}: ${req.originalUrl}`);
    try {
      const result = await fnc(req);
      rsp.status(200).send(result);
    } catch (error) {
      errorHandler.handle(rsp, error);
    }
  };
}

/**
 * Request/response handler that leaves it up to the handler function to send a response, e.g.
 * rsp.status(201).send(...)
 */
export function reqRspHandler(
  errorHandler: ErrorHandler,
  fnc: ReqRspHandler<void>
): ReqRspHandler<void> {
  return async (req, rsp) => {
    log.debugFn(() => `${req.method}: ${req.originalUrl}`);
    try {
      await fnc(req, rsp);
    } catch (error) {
      errorHandler.handle(rsp, error);
    }
  };
}
