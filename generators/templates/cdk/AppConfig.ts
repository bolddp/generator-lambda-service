import { Runtime } from '@aws-cdk/aws-lambda';

export interface AppConfig {
  system: string;
  serviceName: string;
  description: string;
  nodeJsRuntime: Runtime;
  environments: AppEnvironment[];
  schedulerConfig: SchedulerConfig;
  apiConfig: ApiConfig;
  kinesisConsumerConfig: KinesisConsumerConfig;
}

export interface AppEnvironment {
  envType: string;
  awsAccountId: string;
  awsRegion: string;
}

export interface ComponentConfig {
  enabled: boolean;
  memorySize?: number;
  timeout?: number;
}

export interface SchedulerConfig extends ComponentConfig {
  rate?: string;
}

export interface ApiConfig extends ComponentConfig {}

export interface KinesisConsumerConfig extends ComponentConfig {
  kinesisStreamArn?: string;
}
