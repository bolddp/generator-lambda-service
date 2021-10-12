import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as nodejs from '@aws-cdk/aws-lambda-nodejs';
import * as logs from '@aws-cdk/aws-logs';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { Duration, RemovalPolicy } from '@aws-cdk/core';

export interface LambdaFunctionProps extends LambdaServiceStackProps {
  name: string;
  entryPoint: string;
  policyStatements: iam.PolicyStatement[];
}

/**
 * Constructs a Lambda function with an execution role and a log group with
 * a retention period of 7 days.
 */
export class LambdaFunction {
  public instance: nodejs.NodejsFunction;

  constructor(stack: cdk.Construct, props: LambdaFunctionProps) {
    // Create Lambda execution role that have permission to log to Cloudwatch
    const role = new iam.Role(stack, props.id(`${props.name}-role`), {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.AccountPrincipal(props.awsAccountId)
      ),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        effect: iam.Effect.ALLOW,
        resources: ['arn:aws:logs:*:*:*'],
      })
    );
    for (const statement of props.policyStatements) {
      role.addToPolicy(statement);
    }

    this.instance = new nodejs.NodejsFunction(
      stack,
      props.id(`${props.name}-function`),
      {
        runtime: props.nodeJsRuntime,
        memorySize: props.schedulerConfig.memorySize,
        functionName: props.id(props.name),
        timeout: Duration.seconds(props.schedulerConfig.timeout),
        entry: props.entryPoint,
        handler: 'handler',
        role,
      }
    );

    new logs.LogGroup(stack, props.id(`${props.name}-log-group`), {
      logGroupName: `/aws/lambda/${this.instance.functionName}`,
      retention: 7,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
