import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { errorHandlerFactory } from './ErrorHandler';
import { sampleRouterFactory } from './routes/sampleRouter';
import { reqHandler } from './routes/reqHandler';

export default function (app = express()): express.Application {
  const errorHandler = errorHandlerFactory.get();

  app.use(compression());
  app.use(cors());
  // Wrap the JSON body parsing in an exception handler
  app.use((req, res, next) => {
    express.json({
      strict: false,
      limit: '10mb',
    })(req, res, (err) => {
      if (err) {
        errorHandler.handle(res, err);
      } else {
        next();
      }
    });
  });
  app.use(express.urlencoded({ extended: true }));

  app.use(
    '/alive',
    reqHandler(errorHandler, async (req) => {
      return { message: 'Hello from the API!' };
    })
  );

  // Attach routers to app REST API
  app.use('/samples', sampleRouterFactory.get());

  return app;
}
