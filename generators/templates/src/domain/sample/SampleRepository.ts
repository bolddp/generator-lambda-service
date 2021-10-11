import { Log, LogLevel } from '../../utils/Log';
import { Singleton } from '../../utils/Singleton';
import { Sample } from './Sample';

/**
 * An in memory repository for Sample objects.
 */
export class SampleRepository {
  private log: Log = new Log('SampleRepository');
  private sampleMap: Record<string, Sample> = {};

  put(sample: Sample): void {
    this.log.info(`put ${JSON.stringify(sample)}`);
    this.sampleMap[sample.sampleId] = sample;
  }

  get(sampleId: string): Sample | undefined {
    this.log.info(`get by id ${sampleId}`);
    return this.sampleMap[sampleId];
  }

  getAll(): Sample[] {
    this.log.info('get all');
    return Object.values(this.sampleMap);
  }

  delete(sampleId: string): void {
    this.log.info(`delete ${sampleId}`);
    delete this.sampleMap[sampleId];
  }
}

/**
 * Singleton factory for SampleRepository.
 */
export const sampleRepositoryInstance = new Singleton(
  () => new SampleRepository(),
  'SampleRepository'
);
