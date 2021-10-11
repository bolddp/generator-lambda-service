import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { errorHandlerFactory } from './ErrorHandler';
import { sampleRouterFactory } from './routes/sampleRouter';

export default function (app = express()): express.Application {
  app.use(compression());
  app.use(cors());
  // Wrap the JSON body parsing in an exception handler
  app.use((req, res, next) => {
    express.json({
      strict: false,
      limit: '10mb',
    })(req, res, (err) => {
      if (err) {
        errorHandlerFactory.get().handle(res, err);
      } else {
        next();
      }
    });
  });
  app.use(express.urlencoded({ extended: true }));

  // Attach routers to app REST API
  app.use('/samples', sampleRouterFactory.get());

  return app;
}
