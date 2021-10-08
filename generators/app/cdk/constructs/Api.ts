import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { Lambda } from './Lambda';

export interface ApiConfig {
  enabled: boolean;
  memorySize: number;
  timeout: number;
}

export class Api extends cdk.Construct {
  constructor(stack: cdk.Stack, props: LambdaServiceStackProps) {
    super(stack, props.id('api'));

    const lambdaInstance = new Lambda(
      stack,
      'api',
      './dist/webpack/apiHandler.js',
      props
    ).instance;

    new apigateway.LambdaRestApi(stack, props.id('api-gateway'), {
      handler: lambdaInstance,
    });
  }
}
