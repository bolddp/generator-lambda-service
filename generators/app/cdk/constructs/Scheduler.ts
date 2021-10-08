import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { Lambda } from './Lambda';

export interface SchedulerConfig {
  enabled: boolean;
  memorySize: number;
  timeout: number;
  rate: string;
}

export class Scheduler extends cdk.Construct {
  constructor(stack: cdk.Stack, props: LambdaServiceStackProps) {
    super(stack, props.id('scheduler'));

    const lambdaInstance = new Lambda(
      stack,
      'scheduler',
      './dist/webpack/scheduledHandler.js',
      props
    ).instance;

    const rule = new events.Rule(stack, props.id('scheduler-rule'), {
      ruleName: props.id('scheduler-rule'),
      enabled: true,
      schedule: events.Schedule.expression(props.schedulerConfig?.rate!),
    });
    rule.addTarget(new eventsTargets.LambdaFunction(lambdaInstance));
  }
}
