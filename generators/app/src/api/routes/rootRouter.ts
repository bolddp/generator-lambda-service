import { Router } from 'express';
import { reqHandler } from './reqHandler';
import { ErrorHandler, errorHandlerFactory } from '../ErrorHandler';
import { Singleton } from '../../utils/Singleton';

export const rootRouter = (errorHandler: ErrorHandler, router = Router()) => {
  router.get(
    '/alive',
    reqHandler(errorHandler, async (req) => {
      return { message: 'Hello from the API!' };
    })
  );

  return router;
};

export const rootRouterFactory = new Singleton<Router>(
  () => rootRouter(errorHandlerFactory.get()),
  'rootRouter'
);
