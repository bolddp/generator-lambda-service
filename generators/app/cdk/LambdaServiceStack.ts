import * as cdk from '@aws-cdk/core';

export interface LambdaServiceStackProps extends cdk.StackProps {
  resourcePrefix: string;
  awsAccountId: string;
  awsRegion: string;
  envType: string;
  scheduledHandler?: {
    rate: string;
  };
  id: (suffix?: string) => string;
}

export class LambdaServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, props?: LambdaServiceStackProps) {
    super(scope, props?.id(), props);

    if (props?.scheduledHandler) {
    }
  }
}
