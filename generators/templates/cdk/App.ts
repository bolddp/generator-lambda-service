#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaServiceStack } from './LambdaServiceStack';
import appConfig from './appConfig.json';
import { SchedulerConfig } from './constructs/Scheduler';
import { Runtime } from '@aws-cdk/aws-lambda';
import { ApiConfig } from './constructs/Api';

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
  apiConfig: ApiConfig;
}

export class App extends cdk.App {
  constructor(config: AppConfig) {
    super();

    for (const account of config.environments) {
      new LambdaServiceStack(this, {
        system: config.system,
        serviceName: config.serviceName,
        awsAccountId: account.awsAccountId,
        awsRegion: account.awsRegion,
        envType: account.envType,
        description: config.description,
        nodeJsRuntime: config.nodeJsRuntime,
        schedulerConfig: config.schedulerConfig,
        apiConfig: config.apiConfig,
        id: (suffix) =>
          `${config.system}-${account.envType}-${config.serviceName}${
            suffix ? `-${suffix}` : ''
          }`,
      });
    }
  }
}

const app = new App({
  ...appConfig,
  nodeJsRuntime: Runtime.NODEJS_14_X,
});