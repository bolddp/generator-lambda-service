import { Router } from 'express';
import { reqHandler } from './reqHandler';
import { ErrorHandler, errorHandlerFactory } from '../ErrorHandler';
import { Singleton } from '../../utils/Singleton';
import {
  SampleService,
  sampleServiceInstance,
} from '../../domain/sample/SampleService';

export const sampleRouter = (
  sampleService: SampleService,
  errorHandler: ErrorHandler,
  router = Router()
) => {
  router.get(
    '',
    reqHandler(errorHandler, async (req) => {
      return sampleService.getAll();
    })
  );

  router.get(
    '/:sampleId',
    reqHandler(errorHandler, async (req) => {
      const { sampleId } = req!.params;
      return sampleService.getById(sampleId);
    })
  );

  return router;
};

export const sampleRouterFactory = new Singleton<Router>(
  () => sampleRouter(sampleServiceInstance.get(), errorHandlerFactory.get()),
  'sampleRouter'
);
