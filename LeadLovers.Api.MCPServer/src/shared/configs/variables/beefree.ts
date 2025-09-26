import { z } from 'zod';

const configSchema = z.object({
  BEEFREE_API_URL: z.string().url().default('https://api.getbee.io/v1/'),
  BEEFREE_API_TOKEN: z.string().min(1, 'BeeFree API token is required'),
});

export const getBeeFreeConfig = () => {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    process.stderr.write('Failed to validate beefree envs:\n');
    process.stderr.write(JSON.stringify(result.error.format(), null, 2) + '\n');
    process.exit(1);
  }
  return {
    API_URL: result.data.BEEFREE_API_URL,
    API_TOKEN: result.data.BEEFREE_API_TOKEN,
  };
};
