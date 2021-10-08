import { Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { ResourceConfig } from './resources/ResourceConfig';
import { Scheduler, SchedulerConfig } from './resources/Scheduler';

export interface LambdaServiceStackProps extends cdk.StackProps {
  resourcePrefix: string;
  awsAccountId: string;
  awsRegion: string;
  envType: string;
  nodeJsRuntime: Runtime;
  schedulerConfig: SchedulerConfig;
  id: (suffix?: string) => string;
}

export class LambdaServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, props?: LambdaServiceStackProps) {
    super(scope, props?.id(), props);
    this.createStackResources({
      ...props!,
      stack: this,
    });
  }

  private createStackResources(config: ResourceConfig) {
    if (config.schedulerConfig.enabled) {
      new Scheduler(config);
    }
  }
}
