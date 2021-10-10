import Generator = require('yeoman-generator');
import { introduction } from './descriptions';

interface Answers {
  system?: string;
  serviceName: string;
  description: string;
  nodeJsRuntime: number;
  environment1: string;
  environment2: string;
  environment3: string;
  // Scheduled handler
  useScheduledHandler: boolean;
  scheduledHandlerRate?: string;
  scheduledHandlerMemorySize?: number;
  scheduledHandlerTimeout?: number;
  // API
  useApi: boolean;
  apiMemorySize?: number;
  apiTimeout?: number;
}

module.exports = class extends Generator {
  private appConfig: any;

  async prompting() {
    this.log(introduction);

    const questions: Generator.Question[] = [
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
          'Description - a brief text that describes the service. This text will be used for describing the AWS Cloudformation stack, among other things:',
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
          'Scheduled Lambda - should the service include a Lambda that executes at fixed intervals:',
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
          'API Lambda - should the service include a Lambda exposes a REST API:',
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
    ];

    const answers: Answers = await this.prompt<Answers>(questions);
    this.appConfig = {
      system: answers.system,
      serviceName: answers.serviceName,
      description: answers.description,
      nodeJsRuntime: answers.nodeJsRuntime,
      schedulerConfig: answers.useScheduledHandler
        ? {
            enabled: true,
            rate: answers.scheduledHandlerRate,
            memorySize: answers.scheduledHandlerMemorySize,
            timeout: answers.scheduledHandlerTimeout,
          }
        : {
            enabled: false,
          },
      apiConfig: answers.useApi
        ? {
            enabled: true,
            memorySize: answers.apiMemorySize,
            timeout: answers.apiTimeout,
          }
        : {
            enabled: false,
          },
      environments: [
        answers.environment1,
        answers.environment2,
        answers.environment3,
      ].reduce((p, env) => {
        if (env) {
          const [envType, awsAccountId, awsRegion] = env
            .split(',')
            .map((s) => s.trim());
          p.push({ envType, awsAccountId, awsRegion });
        }
        return p;
      }, []),
    };
  }

  async writing() {
    this.fs.copy(this.templatePath('./src'), this.destinationPath('./src'));
    this.fs.copy(this.templatePath('./cdk'), this.destinationPath('./cdk'));
    [
      '.gitignore',
      '.npmrc',
      'cdk.json',
      'jest.config.js',
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'yarn.lock',
    ].forEach((f) =>
      this.fs.copy(this.templatePath(f), this.destinationPath(f))
    );
    this.fs.writeJSON(
      this.destinationPath('./cdk/appConfig.json'),
      this.appConfig
    );
  }

  install() {
    console.log(`Answers: ${JSON.stringify(this.appConfig)}`);
  }
};
