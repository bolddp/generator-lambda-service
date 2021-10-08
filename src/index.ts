import Generator = require('yeoman-generator');
import { introduction } from './descriptions';

interface Answers {
  systemName?: string;
  envTypes: string;
  serviceName: string;
  useScheduledHandler: boolean;
  scheduledHandlerRate?: string;
}

module.exports = class extends Generator {
  private answers: Answers;

  async prompting() {
    this.log(introduction);

    const questions: Generator.Question[] = [
      {
        type: 'input',
        name: 'systemName',
        message:
          'System name - this will be the first part of the component names (e.g. "hfs2"). It can be left empty if you only have one system in your AWS account, which would make the system name prefix redundant:',
        default: 'system',
      },
      {
        type: 'input',
        name: 'envTypes',
        message:
          'Environments - a comma separated list of the environments that this service should support. Should normally be "dev,qa,live":',
        default: 'dev,qa,live',
      },
      {
        type: 'input',
        name: 'serviceName',
        message:
          'Service name - this will identify the components belonging to this service. It will be used right after the environment part in the component names:',
        default: 'sample-service',
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
    ];

    this.answers = await this.prompt<Answers>(questions);
  }

  install() {
    console.log(`Answers: ${JSON.stringify(this.answers)}`);
  }
};
