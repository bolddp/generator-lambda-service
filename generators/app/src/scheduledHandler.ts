import { Handler, ScheduledEvent } from 'aws-lambda';
import { Log } from './utils/Log';

const log = new Log('scheduledHandler');

export const handler: Handler = async (event: ScheduledEvent) => {
  console.log('invoked');
};
