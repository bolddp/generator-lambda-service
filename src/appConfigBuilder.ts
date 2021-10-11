import { Answers } from './index';

export interface AppEnvironment {
  envType: string;
  awsAccountId: string;
  awsRegion: string;
}

export interface ApiConfig {
  enabled: boolean;
  memorySize?: number;
  timeout?: number;
}

export interface SchedulerConfig {
  enabled: boolean;
  memorySize?: number;
  timeout?: number;
  rate?: string;
}

export interface AppConfig {
  system: string;
  serviceName: string;
  description: string;
  nodeJsRuntime: number;
  environments: AppEnvironment[];
  schedulerConfig: SchedulerConfig;
  apiConfig: ApiConfig;
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
