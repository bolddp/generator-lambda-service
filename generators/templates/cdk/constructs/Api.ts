import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { LambdaFunction } from './LambdaFunction';
import { apiPolicyStatements } from '../AppCustomization';

export class Api extends cdk.Construct {
  constructor(stack: cdk.Stack, props: LambdaServiceStackProps) {
    super(stack, props.id('api'));

    const lambda = new LambdaFunction(stack, {
      awsAccountId: props.awsAccountId,
      nodeJsRuntime: props.nodeJsRuntime,
      id: props.id,
      name: 'api',
      entryPoint: './dist/webpack/apiHandler.js',
      memorySize: props.apiConfig.memorySize!,
      timeout: props.apiConfig.timeout!,
      policyStatements: apiPolicyStatements(props),
    });

    new apigateway.LambdaRestApi(stack, props.id('api-gateway'), {
      handler: lambda.instance,
    });
  }
}
