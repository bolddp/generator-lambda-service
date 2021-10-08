#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaServiceStack } from './LambdaServiceStack';

export interface AppEnvironment {
  envType: string;
  awsAccountId: string;
  awsRegion: string;
}

export interface AppConfig {
  system: string;
  serviceName: string;
  description: string;
  environments: AppEnvironment[];
}

export abstract class App extends cdk.App {
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
        id: (suffix) => `${resourcePrefix}-${suffix}`,
      });
    }
  }
}
