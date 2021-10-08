import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events';
import * as eventsTargets from '@aws-cdk/aws-events-targets';
import { Lambda } from './Lambda';
import { LambdaExecutionRole } from './LambdaExecutionRole';
import { ResourceConfig } from './ResourceConfig';

export interface SchedulerConfig {
  enabled: boolean;
  memorySize: number;
  timeout: number;
  rate: string;
}

export class Scheduler extends cdk.Construct {
  constructor(config: ResourceConfig) {
    super(config.stack, config.id('scheduled'));

    const role = new LambdaExecutionRole({
      ...config,
      name: 'scheduler-role',
      policies: [],
    });

    const lambda = new Lambda({
      ...config,
      runtime: config.nodeJsRuntime,
      functionName: 'scheduler',
      memorySize: config.schedulerConfig.memorySize,
      role,
      timeoutSeconds: config.schedulerConfig.timeout,
      entry: './dist/webpack/scheduledHandler.js',
      handler: 'handler',
    });

    const rule = new events.Rule(config.stack, config.id('scheduler-rule'), {
      ruleName: config.id('scheduler-rule'),
      enabled: true,
      schedule: events.Schedule.expression(config.schedulerConfig?.rate!),
    });
    rule.addTarget(new eventsTargets.LambdaFunction(lambda));
  }
}
