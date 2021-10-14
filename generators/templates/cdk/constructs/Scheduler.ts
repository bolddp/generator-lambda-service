import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { LambdaFunction } from './LambdaFunction';
import { schedulerPolicyStatements } from '../AppCustomization';

export class Scheduler extends cdk.Construct {
  constructor(stack: cdk.Stack, props: LambdaServiceStackProps) {
    super(stack, props.id('scheduler'));

    const lambda = new LambdaFunction(stack, {
      awsAccountId: props.awsAccountId,
      nodeJsRuntime: props.nodeJsRuntime,
      id: props.id,
      name: 'scheduler',
      entryPoint: './dist/webpack/scheduledHandler.js',
      memorySize: props.schedulerConfig.memorySize!,
      timeout: props.schedulerConfig.timeout!,
      policyStatements: schedulerPolicyStatements(props),
    });

    const rule = new events.Rule(stack, props.id('scheduler-rule'), {
      ruleName: props.id('scheduler-rule'),
      enabled: true,
      schedule: events.Schedule.expression(props.schedulerConfig?.rate!),
    });
    rule.addTarget(new eventsTargets.LambdaFunction(lambda.instance));
  }
}
