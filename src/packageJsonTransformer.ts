import { AppConfig } from './appConfigBuilder';

export const packageJsonTransformer = (
  content: Buffer,
  appConfig: AppConfig
): string | Buffer => {
  const packageJson = JSON.parse(content.toString('utf-8'));
  // Update simple placeholders
  packageJson.name = appConfig.serviceName;
  packageJson.description = appConfig.description;

  if (!appConfig.apiConfig?.enabled) {
    // Remove excess info that are only needed by the API
    delete packageJson.scripts['local-api'];
    [
      'aws-serverless-express',
      'compression',
      'cors',
      'express',
      '@types/aws-serverless-express',
      '@types/compression',
      '@types/cors',
      '@types/express',
    ].forEach((s) => {
      delete packageJson.dependencies[s];
      delete packageJson.devDependencies[s];
    });
  }
  return JSON.stringify(packageJson, null, 2);
};
