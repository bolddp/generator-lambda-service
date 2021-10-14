import { Log } from '../../utils/Log';
import { Singleton } from '../../utils/Singleton';
import { Sample } from './Sample';
import { SampleKinesisItem } from './SampleKinesisItem';
import { SampleRepository, sampleRepositoryInstance } from './SampleRepository';

export class SampleService {
  private log: Log = new Log('SampleService');
  private sampleRepository: SampleRepository;

  constructor(sampleRepository: SampleRepository) {
    this.sampleRepository = sampleRepository;
  }

  performScheduledMaintenance() {
    this.log.info('performing scheduled maintenance...');
  }

  processKinesisItems(items: SampleKinesisItem[]) {
    for (const item of items) {
      this.log.info(`Kinesis item: ${JSON.stringify(item)}`);
    }
  }

  getById(sampleId: string): Sample {
    const sample = this.sampleRepository.get(sampleId);
    if (!sample) {
      throw new Error(`Sample with id ${sampleId} not found`);
    }
    return sample;
  }

  getAll(): Sample[] {
    return this.sampleRepository.getAll();
  }

  insert(sample: Sample) {
    if (this.sampleRepository.get(sample.sampleId)) {
      throw new Error(`Sample with id ${sample.sampleId} already exists`);
    }
    this.sampleRepository.put(sample);
  }

  update(sample: Sample) {
    if (!this.sampleRepository.get(sample.sampleId)) {
      throw new Error(`Sample with id ${sample.sampleId} not found`);
    }
    this.sampleRepository.put(sample);
  }

  delete(sampleId: string) {
    if (!this.sampleRepository.get(sampleId)) {
      throw new Error(`Sample with id ${sampleId} not found`);
    }
    this.sampleRepository.delete(sampleId);
  }
}

/**
 * Singleton factory for the SampleService.
 */
export const sampleServiceInstance = new Singleton(
  () => new SampleService(sampleRepositoryInstance.get()),
  'SampleService'
);
