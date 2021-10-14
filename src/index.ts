import * as Generator from 'yeoman-generator';
import { AppConfig, appConfigBuilder } from './appConfigBuilder';
import { getQuestions } from './getQuestions';
import { footer, introduction } from './messages';
import { packageJsonTransformer } from './packageJsonTransformer';

export interface Answers {
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
  // Kinesis consumer
  useKinesisConsumer: boolean;
  kinesisConsumerMemorySize?: number;
  kinesisConsumerTimeout?: number;
  kinesisConsumerStreamArn?: string;
}

module.exports = class extends Generator {
  private appConfig: AppConfig;

  async prompting() {
    this.log(introduction);

    const questions = getQuestions();

    const answers: Answers = await this.prompt<Answers>(questions);
    this.appConfig = appConfigBuilder(answers);
  }

  async writing() {
    this.copySrcFolder();
    this.fs.copy(this.templatePath('./cdk'), this.destinationPath('./cdk'));
    // Prep package.json
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        process: (content) => packageJsonTransformer(content, this.appConfig),
      }
    );
    [
      '.gitignore',
      '.npmrc',
      '.prettierrc',
      'cdk.json',
      'jest.config.js',
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

  private copySrcFolder() {
    this.fs.copy(this.templatePath('./src'), this.destinationPath('./src'));
    if (!this.appConfig.apiConfig.enabled) {
      this.fs.delete(this.destinationPath('./src/api'));
      this.fs.delete(this.destinationPath('./src/apiHandler.ts'));
    }
    if (!this.appConfig.schedulerConfig.enabled) {
      this.fs.delete(this.destinationPath('./src/scheduledHandler.ts'));
    }
    if (!this.appConfig.kinesisConsumerConfig.enabled) {
      this.fs.delete(this.destinationPath('./src/kinesisConsumerHandler.ts'));
    }
  }

  end() {
    this.log(footer(this.appConfig));
  }
};
