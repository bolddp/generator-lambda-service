import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import { LambdaServiceStackProps } from '../LambdaServiceStack';

export interface LambdaExecutionRoleProps extends LambdaServiceStackProps {
  name: string;
  policies: iam.PolicyStatement[];
}

export class LambdaExecutionRole extends iam.Role {
  constructor(stack: cdk.Construct, props: LambdaExecutionRoleProps) {
    super(stack, props.id(props.name), {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.AccountPrincipal(props.awsAccountId)
      ),
    });

    this.addToPolicy(
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

    for (const statement of props.policies) {
      this.addToPolicy(statement);
    }
  }
}
