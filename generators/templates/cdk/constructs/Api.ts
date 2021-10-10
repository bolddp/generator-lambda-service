import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { LambdaFunction } from './LambdaFunction';
import { apiPolicyStatements } from '../AppCustomization';

export interface ApiConfig {
  enabled: boolean;
  memorySize: number;
  timeout: number;
}

export class Api extends cdk.Construct {
  constructor(stack: cdk.Stack, props: LambdaServiceStackProps) {
    super(stack, props.id('api'));

    const lambda = new LambdaFunction(stack, {
      ...props,
      name: 'api',
      entryPoint: './dist/webpack/apiHandler.js',
      policyStatements: apiPolicyStatements(props),
    });

    new apigateway.LambdaRestApi(stack, props.id('api-gateway'), {
      handler: lambda.instance,
    });
  }
}
