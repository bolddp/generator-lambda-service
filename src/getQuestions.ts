import * as Generator from 'yeoman-generator';

export const getQuestions = (): Generator.Question[] => {
  return [
    {
      type: 'input',
      name: 'system',
      message:
        'System name - this will be the first part of the component names (e.g. "iot"). It can be left empty if you only have one system in your AWS account, which would make the system name prefix redundant:',
      default: 'system',
    },
    {
      type: 'input',
      name: 'serviceName',
      message:
        'Service name - this will identify the components belonging to this service. It will be used right after the environment part in the component names:',
      default: 'sample-service',
    },
    {
      type: 'input',
      name: 'description',
      message:
        'Description - a brief text that describes the service. This text will be used for describing the AWS Cloudformation stack and the generated package.json:',
    },
    {
      type: 'number',
      name: 'nodeJsRuntime',
      message:
        'Node.js runtime - what major version of the Node.js runtime should the service Lambdas use:',
      default: 14,
    },
    {
      type: 'input',
      name: 'environment1',
      message:
        'Environment 1 (of 3) - a comma separated string containing the environment type, the AWS account id and the AWS region (e.g. "dev,123456789012,eu-west-1"):',
    },
    {
      type: 'input',
      name: 'environment2',
      message:
        'Environment 2 (of 3) - a comma separated string containing the environment type, the AWS account id and the AWS region (e.g. "dev,123456789012,eu-west-1"). Leave empty to skip:',
    },
    {
      when: (a) => a.environment2,
      type: 'input',
      name: 'environment3',
      message:
        'Environment 3 (of 3) - a comma separated string containing the environment type, the AWS account id and the AWS region (e.g. "dev,123456789012,eu-west-1"). Leave empty to skip:',
    },
    {
      type: 'confirm',
      name: 'useScheduledHandler',
      message:
        '**** Scheduled Lambda - should the service include a Lambda that executes at fixed intervals:',
      default: false,
    },
    {
      when: (a) => a.useScheduledHandler,
      type: 'input',
      name: 'scheduledHandlerRate',
      message:
        'Scheduled Lambda - how often should it trigger (use syntax described here https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html):',
      default: 'rate(1 minute)',
    },
    {
      when: (a) => a.useScheduledHandler,
      type: 'number',
      name: 'scheduledHandlerMemorySize',
      message:
        'Scheduled Lambda - how much memory (Mb) should be allocated to the Lambda:',
      default: 256,
    },
    {
      when: (a) => a.useScheduledHandler,
      type: 'number',
      name: 'scheduledHandlerTimeout',
      message:
        'Scheduled Lambda - what timeout (seconds) should the Lambda have:',
      default: 10,
    },
    {
      type: 'confirm',
      name: 'useApi',
      message:
        '**** API Lambda - should the service include a Lambda exposes a REST API:',
      default: false,
    },
    {
      when: (a) => a.useApi,
      type: 'number',
      name: 'apiMemorySize',
      message:
        'API Lambda - how much memory (Mb) should be allocated to the Lambda:',
      default: 256,
    },
    {
      when: (a) => a.useApi,
      type: 'number',
      name: 'apiTimeout',
      message: 'API Lambda - what timeout (seconds) should the Lambda have:',
      default: 10,
    },
    {
      type: 'confirm',
      name: 'useKinesisConsumer',
      message:
        '**** Kinesis consumer Lambda - should the service include a Lambda that consumes a Kinesis stream:',
      default: false,
    },
    {
      when: (a) => a.useKinesisConsumer,
      type: 'number',
      name: 'kinesisConsumerMemorySize',
      message:
        'Kinesis consumer Lambda - how much memory (Mb) should be allocated to the Lambda:',
      default: 256,
    },
    {
      when: (a) => a.useKinesisConsumer,
      type: 'number',
      name: 'kinesisConsumerTimeout',
      message:
        'Kinesis consumer Lambda - what timeout (seconds) should the Lambda have:',
      default: 10,
    },
    {
      when: (a) => a.useKinesisConsumer,
      type: 'input',
      name: 'kinesisConsumerStreamArn',
      message:
        "Kinesis consumer Lambda - what's the ARN of the Kinesis stream that should be consumed (you can use placeholder {envType}, {awsAccountId} and {awsRegion} to allow for different ARN's for each of the provided environment):",
      default: 'kinesis-stream-arn',
    },
  ];
};
