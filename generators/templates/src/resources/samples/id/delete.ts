import { sampleServiceInstance } from '../../../domain/sample/SampleService';
import { apiHandler } from '../../apiHandler';

export const handler = apiHandler<void>(async (event) =>
  sampleServiceInstance.get().delete(event.pathParameters?.id!)
);
