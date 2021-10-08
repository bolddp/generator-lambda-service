import * as cdk from '@aws-cdk/core';
import { LambdaServiceStackProps } from '../LambdaServiceStack';

export interface ResourceConfig extends LambdaServiceStackProps {
  stack: cdk.Stack;
}
