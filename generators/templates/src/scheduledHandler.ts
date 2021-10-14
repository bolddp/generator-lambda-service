import { Handler, ScheduledEvent } from 'aws-lambda';
import { sampleServiceInstance } from './domain/sample/SampleService';

const sampleService = sampleServiceInstance.get();

export const handler: Handler = async (/* event: ScheduledEvent */) => {
  sampleService.performScheduledMaintenance();
};
