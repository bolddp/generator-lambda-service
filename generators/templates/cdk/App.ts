#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaServiceStack } from './LambdaServiceStack';
import appConfig from './appConfig.json';
import { Runtime } from '@aws-cdk/aws-lambda';
import { AppConfig } from './AppConfig';

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
        kinesisConsumerConfig: config.kinesisConsumerConfig,
        id: (suffix) =>
          `${config.system}-${account.envType}-${config.serviceName}${
            suffix ? `-${suffix}` : ''
          }`,
        replace: (input) =>
          input
            .replace(/\{envType\}/g, account.envType)
            .replace(/\{awsAccountId\}/g, account.awsAccountId)
            .replace(/\{awsRegion\}/g, account.awsRegion),
      });
    }
  }
}

const app = new App({
  ...appConfig,
  nodeJsRuntime: Runtime.NODEJS_14_X,
});
