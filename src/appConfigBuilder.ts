import { Answers } from './index';

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

export interface ApiConfig extends ComponentConfig {}

export interface SchedulerConfig extends ComponentConfig {
  rate?: string;
}

export interface KinesisConsumerConfig extends ComponentConfig {
  kinesisStreamArn?: string;
}

export interface AppConfig {
  system: string;
  serviceName: string;
  description: string;
  nodeJsRuntime: number;
  environments: AppEnvironment[];
  schedulerConfig: SchedulerConfig;
  apiConfig: ApiConfig;
  kinesisConsumerConfig: KinesisConsumerConfig;
}

export const appConfigBuilder = (answers: Answers): AppConfig => {
  return {
    system: answers.system,
    serviceName: answers.serviceName,
    description: answers.description,
    nodeJsRuntime: answers.nodeJsRuntime,
    schedulerConfig: answers.useScheduledHandler
      ? {
          enabled: true,
          rate: answers.scheduledHandlerRate,
          memorySize: answers.scheduledHandlerMemorySize,
          timeout: answers.scheduledHandlerTimeout,
        }
      : {
          enabled: false,
        },
    apiConfig: answers.useApi
      ? {
          enabled: true,
          memorySize: answers.apiMemorySize,
          timeout: answers.apiTimeout,
        }
      : {
          enabled: false,
        },
    kinesisConsumerConfig: answers.useKinesisConsumer
      ? {
          enabled: true,
          memorySize: answers.kinesisConsumerMemorySize,
          timeout: answers.kinesisConsumerTimeout,
          kinesisStreamArn: answers.kinesisConsumerStreamArn,
        }
      : {
          enabled: false,
        },
    environments: [
      answers.environment1,
      answers.environment2,
      answers.environment3,
    ].reduce((p, env) => {
      if (env) {
        const [envType, awsAccountId, awsRegion] = env
          .split(',')
          .map((s) => s.trim());
        p.push({ envType, awsAccountId, awsRegion });
      }
      return p;
    }, []),
  };
};
