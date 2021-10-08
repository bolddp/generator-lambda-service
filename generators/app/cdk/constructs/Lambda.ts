import * as cdk from '@aws-cdk/core';
import * as nodejs from '@aws-cdk/aws-lambda-nodejs';
import * as logs from '@aws-cdk/aws-logs';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { LambdaExecutionRole } from './LambdaExecutionRole';
import { Duration, RemovalPolicy } from '@aws-cdk/core';

/**
 * Constructs a Lambda function with an execution role and a log group with
 * a retention period of 7 days.
 */
export class Lambda {
  public instance: nodejs.NodejsFunction;

  constructor(
    stack: cdk.Construct,
    name: string,
    entryPoint: string,
    props: LambdaServiceStackProps
  ) {
    const role = new LambdaExecutionRole(stack, {
      ...props,
      name: props.id(`${name}-role`),
      policies: [],
    });

    this.instance = new nodejs.NodejsFunction(
      stack,
      props.id(`${name}-function`),
      {
        runtime: props.nodeJsRuntime,
        memorySize: props.schedulerConfig.memorySize,
        functionName: props.id(name),
        timeout: Duration.seconds(props.schedulerConfig.timeout),
        entry: entryPoint,
        handler: 'handler',
        role,
      }
    );

    new logs.LogGroup(stack, props.id(`${name}-log-group`), {
      logGroupName: `/aws/lambda/${this.instance.functionName}`,
      retention: 7,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
