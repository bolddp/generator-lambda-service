import * as fsPath from 'path';
import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as nodejs from '@aws-cdk/aws-lambda-nodejs';
import { LambdaServiceStackProps } from '../LambdaServiceStack';
import { Runtime } from '@aws-cdk/aws-lambda';

export interface ApiConfig {
  enabled: boolean;
  memorySize: number;
  timeout: number;
}

// type ApiResource = (resourceConfig: ResourceConfig) => apigateway.Resource;
// type ApiMethod = (httpMethod: string) => apigateway.Method;
interface ResourceConfig {
  methods?: string[];
  resources?: ResourceConfigMap;
}

type ResourceConfigMap = {
  [key: string]: ResourceConfig;
};

const apiFunction = (
  stack: cdk.Stack,
  path: string,
  httpMethod: string
): nodejs.NodejsFunction => {
  return new nodejs.NodejsFunction(
    stack,
    `${path}-${httpMethod}`.replace(/[\/]/g, '-'),
    {
      runtime: Runtime.NODEJS_14_X,
      bundling: { minify: true },
      entry: fsPath.join(
        __dirname,
        `/../../src//resources/${path.replace(
          /[{}]/g,
          ''
        )}/${httpMethod.toLowerCase()}.ts`
      ),
      handler: `handler`,
    }
  );
};

const restApi = (stack: cdk.Stack, id: string, apiConfig: ResourceConfig) => {
  const applyResource = (
    parent: apigateway.IResource,
    sourceConfig: ResourceConfig
  ) => {
    // Create methods for the resources
    for (const method of sourceConfig.methods || []) {
      parent.addMethod(
        method,
        new apigateway.LambdaIntegration(
          apiFunction(stack, parent.path, method)
        )
      );
    }
    // Create subresources
    for (const subKey of Object.keys(sourceConfig.resources || {})) {
      const subResource = parent.addResource(subKey.replace(/\//, ''));
      applyResource(subResource, sourceConfig.resources![subKey]);
    }
  };

  const api = new apigateway.RestApi(stack, id, {
    deployOptions: { stageName: 'prod' },
  });
  applyResource(api.root, apiConfig);
};

export class Api extends cdk.Construct {
  constructor(stack: cdk.Stack, props: LambdaServiceStackProps) {
    super(stack, props.id('api'));

    // const api = new apigateway.RestApi(stack, props.id('api-gateway'), {
    //   deployOptions: { stageName: 'prod' },
    // });
    const api = restApi(stack, props.id('api-function'), {
      resources: {
        '/alive': {
          resources: {
            '/{name}': { methods: ['GET'] },
          },
        },
        '/samples': {
          methods: ['GET'],
          resources: {
            '/{id}': {
              methods: ['GET', 'DELETE'],
            },
          },
        },
      },
    });
    // const aliveFunction = new lambda.Function(stack, 'alive-function', {
    //   runtime: Runtime.NODEJS_14_X,
    //   code: lambda.Code.fromAsset('./dist/resources'),
    //   handler: 'alive.handler',
    // });
    // const alive = api.root.addResource('alive');
    // const aliveName = alive.addResource('{name}');
    // aliveName.addMethod('GET', new apigateway.LambdaIntegration(aliveFunction));

    // const lambda = new LambdaFunction(stack, {
    //   ...props,
    //   name: 'api',
    //   entryPoint: './dist/webpack/apiHandler.js',
    //   policyStatements: apiPolicyStatements(props),
    // });
  }
}
