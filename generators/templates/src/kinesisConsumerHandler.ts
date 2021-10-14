import { Handler, KinesisStreamEvent } from 'aws-lambda';
import { SampleKinesisItem } from './domain/sample/SampleKinesisItem';
import { sampleServiceInstance } from './domain/sample/SampleService';
import { Log } from './utils/Log';

const sampleService = sampleServiceInstance.get();
const log = new Log('kinesisConsumerHandler');

export const handler: Handler = async (event: KinesisStreamEvent) => {
  // Decode the incoming data from base64
  log.info(JSON.stringify(event));
  const items: SampleKinesisItem[] = event.Records.map((r) => {
    const jsonStr = Buffer.from(r.kinesis.data, 'base64').toString('utf-8');
    return JSON.parse(jsonStr);
  });
  sampleService.processKinesisItems(items);
};
