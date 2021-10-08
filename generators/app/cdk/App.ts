#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaServiceStack } from './LambdaServiceStack';
import appConfig from './appConfig.json';
import { SchedulerConfig } from './resources/Scheduler';
import { Runtime } from '@aws-cdk/aws-lambda';

export interface AppEnvironment {
  envType: string;
  awsAccountId: string;
  awsRegion: string;
}

export interface AppConfig {
  system: string;
  serviceName: string;
  description: string;
  nodeJsRuntime: Runtime;
  environments: AppEnvironment[];
  schedulerConfig: SchedulerConfig;
}

export class App extends cdk.App {
  constructor(config: AppConfig) {
    super();

    for (const account of config.environments) {
      const resourcePrefix = `${config.system}-${account.envType}-${config.serviceName}`;
      new LambdaServiceStack(this, {
        resourcePrefix,
        awsAccountId: account.awsAccountId,
        awsRegion: account.awsRegion,
        envType: account.envType,
        description: config.description,
        nodeJsRuntime: config.nodeJsRuntime,
        schedulerConfig: config.schedulerConfig,
        id: (suffix) => `${resourcePrefix}${suffix ? `-${suffix}` : ''}`,
      });
    }
  }
}

const app = new App({
  ...appConfig,
  nodeJsRuntime: Runtime.NODEJS_14_X,
});
