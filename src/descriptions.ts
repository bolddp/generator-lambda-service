export const introduction = `
This generator vill scaffold a Lambda micro service consisting of one or more Lambdas that can perform different tasks in a specific domain of your system.
Consistent naming will be applied across the service components in the format {system}-{envType}-{serviceName}...

The following components can be scaffolded for the service by this template:
* A scheduled Lambda that triggers at fixed intervals according to a timer or a CRON expression
* A Lambda that consumes a Kinesis stream
* An SQS queue and a Lambda consuming it, that can be used to send asynchronous information to the service
* A Lambda exposing a private or public API through API Gateway, allowing for synchronous requests to the service
`;
