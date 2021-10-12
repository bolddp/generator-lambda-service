import { Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Api, ApiConfig } from './constructs/Api';
import { Scheduler, SchedulerConfig } from './constructs/Scheduler';

export interface LambdaServiceStackProps extends cdk.StackProps {
  system: string;
  serviceName: string;
  description: string;
  awsAccountId: string;
  awsRegion: string;
  envType: string;
  nodeJsRuntime: Runtime;
  schedulerConfig: SchedulerConfig;
  apiConfig: ApiConfig;
  id: (suffix?: string) => string;
}

export class LambdaServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, props: LambdaServiceStackProps) {
    super(scope, props.id(), {
      env: { account: props.awsAccountId, region: props.awsRegion },
      stackName: props.id(),
      description: props.description,
    });
    this.createStackResources(props!);
  }

  private createStackResources(props: LambdaServiceStackProps) {
    if (props.schedulerConfig.enabled) {
      new Scheduler(this, props);
    }
    if (props.apiConfig.enabled) {
      new Api(this, props);
    }
  }
}