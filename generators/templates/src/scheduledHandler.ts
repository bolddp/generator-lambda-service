import { Handler, ScheduledEvent } from 'aws-lambda';
import { sampleServiceInstance } from './domain/sample/SampleService';
import { Log } from './utils/Log';

const sampleService = sampleServiceInstance.get();

export const handler: Handler = async (/* event: ScheduledEvent */) => {
  sampleService.performScheduledMaintenance();
};
