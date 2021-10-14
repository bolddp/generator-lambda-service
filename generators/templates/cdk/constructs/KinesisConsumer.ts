import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { kinesisConsumerPolicyStatements } from '../AppCustomization';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { LambdaFunction } from './LambdaFunction';
import { StartingPosition } from '@aws-cdk/aws-lambda';

export class KinesisConsumer extends cdk.Construct {
  constructor(stack: cdk.Stack, props: LambdaServiceStackProps) {
    super(stack, props.id('kinesis-consumer'));

    const kinesisStreamArn = props.replace(
      props.kinesisConsumerConfig.kinesisStreamArn!
    );

    const lambda = new LambdaFunction(stack, {
      awsAccountId: props.awsAccountId,
      nodeJsRuntime: props.nodeJsRuntime,
      id: props.id,
      name: 'kinesis-consumer',
      entryPoint: './dist/webpack/kinesisConsumerHandler.js',
      memorySize: props.kinesisConsumerConfig.memorySize!,
      timeout: props.kinesisConsumerConfig.timeout!,
      policyStatements: [
        new iam.PolicyStatement({
          actions: [
            'kinesis:DescribeStream',
            'kinesis:GetRecords',
            'kinesis:GetShardIterator',
          ],
          effect: iam.Effect.ALLOW,
          resources: [kinesisStreamArn],
        }),
        ...kinesisConsumerPolicyStatements(props),
      ],
    });

    lambda.instance.addEventSourceMapping(props.id('kinesis-consumer-source'), {
      eventSourceArn: kinesisStreamArn,
      startingPosition: StartingPosition.TRIM_HORIZON,
      batchSize: 50,
    });
  }
}
