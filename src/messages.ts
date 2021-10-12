import { AppConfig } from './appConfigBuilder';

const sep = '='.repeat(80);

export const introduction = `
${sep}

This generator vill scaffold a Lambda micro service consisting of one or more Lambdas that can perform different tasks in a specific domain of your system.
Consistent naming will be applied across the service components in the format {system}-{envType}-{serviceName}...

The template uses AWS CDK (Cloud Development Kit) to define the Cloudformation template that contain the service resources.

The following components can be scaffolded for the service by this template:
* A scheduled Lambda that triggers at fixed intervals according to a timer or a CRON expression
* A Lambda that consumes a Kinesis stream
* An SQS queue and a Lambda consuming it, that can be used to send asynchronous information to the service
* A Lambda exposing a private or public API through API Gateway, allowing for synchronous requests to the service

${sep}
`;

export const footer = (config: AppConfig) => `
${sep}

Your template has been generated and you can start customizing it:
* ./cdk/appConfig.json contains the basic configuration of the micro service. If you want to change the config of any service component, e.g. the memory size or Node.js runtime of a Lambda at a later state, you can do that here.
* ./cdk/appCustomization.ts is where you can provide additional policies (permissions) for the different Lambdas and also add other resources that the service needs, e.g. DynamoDb tables, S3 buckets etc.

If you want to perform a test deploy of the service, you should be able to do that by building the project and then use the AWS CDK command line interface:

> npm install -g aws-cdk (if you haven't installed it already)
> npm run build
> cdk deploy --profile <AWS config profile> ${config.system}-${config.environments[0].envType}-${config.serviceName}

${sep}
`;
