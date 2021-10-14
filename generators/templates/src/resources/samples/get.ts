import { Sample } from '../../domain/sample/Sample';
import { sampleServiceInstance } from '../../domain/sample/SampleService';
import { apiHandler } from '../apiHandler';

export const handler = apiHandler<Sample[]>(async (event) =>
  sampleServiceInstance.get().getAll()
);
