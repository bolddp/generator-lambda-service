import * as iam from '@aws-cdk/aws-iam';
import { LambdaServiceStackProps } from './LambdaServiceStack';

/**
 * Policy statements that the scheduler Lambda needs to access the AWS resources
 * it consumes, e.g. DynamoDb tables, S3 buckets etc.
 */
export const schedulerPolicyStatements = (
  props: LambdaServiceStackProps
): iam.PolicyStatement[] => [
  // Sample policy that gives the scheduler Lambda full access to all DynamoDb tables
  // that have the prefix {serviceName}-{envType}
  //
  // new iam.PolicyStatement({
  //   actions: ['dynamodb:*'],
  //   effect: iam.Effect.ALLOW,
  //   resources: [
  //     `arn:aws:dynamodb:${props.awsRegion}:${props.awsAccountId}:table/${props.serviceName}-${props.envType}-*`,
  //   ],
  // }),
];

/**
 * Policy statements that the Api Lambda needs to access the AWS resources
 * it consumes, e.g. DynamoDb tables, S3 buckets etc.
 */
export const apiPolicyStatements = (
  props: LambdaServiceStackProps
): iam.PolicyStatement[] => [
  // Sample policy that gives the Api Lambda full access to an S3 bucket that is named after
  // the AWS account it belongs to.
  // new iam.PolicyStatement({
  //   actions: ['s3:*'],
  //   effect: iam.Effect.ALLOW,
  //   resources: [
  //     `arn:aws:s3:::sample-bucket-${props.envType}-${props.awsAccountId}`,
  //     `arn:aws:s3:::sample-bucket-${props.envType}-${props.awsAccountId}/*`,
  //   ],
  // }),
];
