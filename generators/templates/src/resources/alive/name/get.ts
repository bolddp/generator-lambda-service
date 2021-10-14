import { apiHandler } from '../../apiHandler';

export const handler = apiHandler<{ message: string }>(async (event) => {
  const name = event.pathParameters?.name;
  if (name == 'Donald') {
    throw new Error('No fucking way!');
  }
  return { message: `Hello, ${name}` };
});
