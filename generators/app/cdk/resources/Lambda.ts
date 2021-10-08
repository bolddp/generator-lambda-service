import * as nodejs from '@aws-cdk/aws-lambda-nodejs';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';

import { Duration } from '@aws-cdk/core';
import { ResourceConfig } from './ResourceConfig';
import { Runtime } from '@aws-cdk/aws-lambda';

export interface LambdaConfig extends ResourceConfig {
  runtime: Runtime;
  memorySize: number;
  functionName: string;
  timeoutSeconds: number;
  entry: string;
  handler: string;
  role: iam.Role;
}

export class Lambda extends nodejs.NodejsFunction {
  constructor(config: LambdaConfig) {
    super(config.stack!, config.id('function'), {
      runtime: config.runtime,
      memorySize: config.memorySize,
      functionName: config.id(config.functionName),
      timeout: Duration.seconds(config.timeoutSeconds),
      entry: config.entry,
      handler: config.handler,
      role: config.role,
    });
  }
}
