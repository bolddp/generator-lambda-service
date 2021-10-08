import * as iam from '@aws-cdk/aws-iam';
import { ResourceConfig } from './ResourceConfig';

export interface LambdaExecutionRoleConfig extends ResourceConfig {
  name: string;
  policies: iam.PolicyStatement[];
}

export class LambdaExecutionRole extends iam.Role {
  constructor(config: LambdaExecutionRoleConfig) {
    super(config.stack!, config.id(config.name), {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.AccountPrincipal(config.awsAccountId)
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

    for (const statement of config.policies) {
      this.addToPolicy(statement);
    }
  }
}
